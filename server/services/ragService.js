import { getGroqClient } from "../utils/groqClient.js";
import { getEmbeddings } from "../utils/embeddings.js";
import { queryVectorsGrouped } from "../utils/ragUtils.js";
import redis from "../config/redis.js";

const EMBED_TTL = 86400;
const RAG_TTL = 3600;
const HISTORY_TTL = 3600;     // 1 hour — same as RAG cache
const MAX_HISTORY = 10;        // last 10 exchanges = 20 messages

const getCachedEmbedding = async (text, sessionId) => {
  const key = `embed:${sessionId}:${text}`;
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  } catch (_) {}

  const [embedding] = await getEmbeddings([text]);

  try {
    await redis.set(key, JSON.stringify(embedding), "EX", EMBED_TTL);
  } catch (_) {}

  return embedding;
};

// ✅ Fetch conversation history from Redis
const getHistory = async (sessionId, userId) => {
  try {
    const key = `history:${userId}:${sessionId}`;
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

// ✅ Append a new exchange and persist to Redis
const appendHistory = async (sessionId, userId, userMessage, aiReply) => {
  try {
    const key = `history:${userId}:${sessionId}`;
    const history = await getHistory(sessionId, userId);

    history.push({ role: "user", content: userMessage });
    history.push({ role: "assistant", content: aiReply });

    // Keep only last MAX_HISTORY exchanges to avoid token overflow
    const trimmed = history.slice(-MAX_HISTORY * 2);

    await redis.set(key, JSON.stringify(trimmed), "EX", HISTORY_TTL);
  } catch (_) {}
};

export const ragChat = async ({ message, sessionId, userId }) => {
  if (!sessionId) {
    return {
      reply: "No documents are attached in this session. Please upload PDFs before asking questions.",
      sources: []
    };
  }

  // ✅ Cache key includes message only — history is fetched separately
  // Don't cache responses that depend on history since context changes each turn
  const queryEmbedding = await getCachedEmbedding(message, sessionId);
  const docs = await queryVectorsGrouped(queryEmbedding, sessionId, userId);

  if (!docs.length) {
    return {
      reply: "The uploaded documents do not contain information related to your question.",
      sources: []
    };
  }

  const context = docs
    .map(d =>
      `Document: ${d.filename}\n` +
      d.chunks.map(c => c.content).join("\n")
    )
    .join("\n\n");

  // ✅ Fetch conversation history for this session
  const conversationHistory = await getHistory(sessionId, userId);

  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `You are a document assistant. Answer ONLY using the provided documents. 
If the answer is not in the documents, say you don't know. 
Be concise but complete. Maintain context from the conversation history.`
      },
      {
        role: "system",
        content: "Document Context:\n" + context
      },
      ...conversationHistory,   // ✅ inject prior turns
      {
        role: "user",
        content: message
      }
    ]
  });

  const reply = completion.choices[0].message.content;

  // ✅ Persist this exchange to history
  await appendHistory(sessionId, userId, message, reply);

  const result = {
    reply,
    sources: docs.map(d => d.filename)
  };

  // Cache single-turn responses that don't depend on history
  // Only cache if this is the first message (no prior history)
  if (conversationHistory.length === 0) {
    try {
      const cacheKey = `rag:${userId}:${sessionId}:${message}`;
      await redis.set(cacheKey, JSON.stringify(result), "EX", RAG_TTL);
    } catch (_) {}
  }

  return result;
};