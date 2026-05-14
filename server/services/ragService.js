import { getGroqClient } from "../utils/groqClient.js";
import { getEmbeddings } from "../utils/embeddings.js";
import { queryVectorsGrouped } from "../utils/ragUtils.js";
import redis from "../config/redis.js";

const EMBED_TTL = 86400;
const RAG_TTL = 3600;
const HISTORY_TTL = 3600;
const MAX_HISTORY = 10;

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

const getHistory = async (sessionId, userId) => {
  try {
    const key = `history:${userId}:${sessionId}`;
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

const appendHistory = async (sessionId, userId, userMessage, aiReply) => {
  try {
    const key = `history:${userId}:${sessionId}`;
    const history = await getHistory(sessionId, userId);

    history.push({ role: "user", content: userMessage });
    history.push({ role: "assistant", content: aiReply });

    const trimmed = history.slice(-MAX_HISTORY * 2);
    await redis.set(key, JSON.stringify(trimmed), "EX", HISTORY_TTL);
  } catch (_) {}
};

export const ragChat = async ({ message, sessionId, userId }) => {
  if (!sessionId) {
    return {
      reply: "No documents are attached in this session. Please upload PDFs before asking questions.",
      sources: [],
      citations: []
    };
  }

  const queryEmbedding = await getCachedEmbedding(message, sessionId);
  const docs = await queryVectorsGrouped(queryEmbedding, sessionId, userId);

  if (!docs.length) {
    return {
      reply: "The uploaded documents do not contain information related to your question.",
      sources: [],
      citations: []
    };
  }

  // Build numbered context — each chunk gets a reference number
  // Format: [1] filename \n chunk content
  const numberedChunks = [];
  docs.forEach(d => {
    d.chunks.forEach(c => {
      numberedChunks.push({
        ref: numberedChunks.length + 1,
        filename: d.filename,
        content: c.content,
        score: c.score
      });
    });
  });

  const context = numberedChunks
    .map(c => `[${c.ref}] ${c.filename}\n${c.content}`)
    .join("\n\n");

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
Be concise but complete. Maintain context from the conversation history.
Each document chunk is labeled with a reference number like [1], [2], etc.
At the end of your answer, on a new line, write CITATIONS: followed by the reference numbers you used, comma separated.
Example: CITATIONS: 1, 3, 5`
      },
      {
        role: "system",
        content: "Document Context:\n" + context
      },
      ...conversationHistory,
      {
        role: "user",
        content: message
      }
    ]
  });

  const raw = completion.choices[0].message.content;
  console.log("RAW LLM RESPONSE:", raw);

  // Parse reply and citation line apart
  const citationMatch = raw.match(/CITATIONS:\s*([\d,\s]+)$/im);
  const reply = raw.replace(/CITATIONS:\s*[\d,\s]+$/im, "").trim();

  // Map cited reference numbers back to chunk metadata
  const citations = [];
  if (citationMatch) {
    const refs = citationMatch[1]
      .split(",")
      .map(r => parseInt(r.trim()))
      .filter(r => !isNaN(r));

    refs.forEach(ref => {
      const chunk = numberedChunks.find(c => c.ref === ref);
      if (chunk) {
        citations.push({
          ref,
          filename: chunk.filename,
          // Return first 200 chars of the chunk as the excerpt
          excerpt: chunk.content.slice(0, 200).trim() + (chunk.content.length > 200 ? "..." : ""),
          score: chunk.score
        });
      }
    });
  }

  await appendHistory(sessionId, userId, message, reply);

  const result = { reply, sources: docs.map(d => d.filename), citations };

  if (conversationHistory.length === 0) {
    try {
      const cacheKey = `rag:${userId}:${sessionId}:${message}`;
      await redis.set(cacheKey, JSON.stringify(result), "EX", RAG_TTL);
    } catch (_) {}
  }

  return result;
};