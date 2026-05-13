import { getGroqClient } from "../utils/groqClient.js";
import { getEmbeddings } from "../utils/embeddings.js";
import { queryVectorsGrouped } from "../utils/ragUtils.js";
import redis from "../config/redis.js";

const EMBED_TTL = 86400;   // 24 hours
const RAG_TTL = 3600;    // 1 hour

/**
 * Returns a cached embedding or computes + caches a new one.
 */
const getCachedEmbedding = async (text, sessionId) => {
  const key = `embed:${sessionId}:${text}`;
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  } catch (_) { /* non-fatal */ }

  const [embedding] = await getEmbeddings([text]);

  try {
    await redis.set(key, JSON.stringify(embedding), "EX", EMBED_TTL);
  } catch (_) { /* non-fatal */ }

  return embedding;
};

/**
 * Core RAG pipeline with full Redis caching.
 */
export const ragChat = async ({ message, sessionId, userId }) => {
  if (!sessionId) {
    return {
      reply: "No documents are attached in this session. Please upload PDFs before asking questions.",
      sources: []
    };
  }

  const cacheKey = `rag:${userId}:${sessionId}:${message}`;

  // 1. Cache hit
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (_) { /* non-fatal */ }

  // 2. Embed query
  const queryEmbedding = await getCachedEmbedding(message, sessionId);

  // 3. Vector retrieval
  const docs = await queryVectorsGrouped(queryEmbedding, sessionId, userId);

  if (!docs.length) {
    return {
      reply: "The uploaded documents do not contain information related to your question.",
      sources: []
    };
  }

  // 4. Build context
  const context = docs
    .map(
      d =>
        `Document: ${d.filename}\n` +
        d.chunks.map(c => c.content).join("\n")
    )
    .join("\n\n");

  // 5. LLM call
  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "Answer ONLY using the provided documents. If not found, say you don't know."
      },
      { role: "system", content: "Context:\n" + context },
      { role: "user", content: message }
    ]
  });

  const result = {
    reply: completion.choices[0].message.content,
    sources: docs.map(d => d.filename)
  };

  // 6. Cache result
  try {
    await redis.set(cacheKey, JSON.stringify(result), "EX", RAG_TTL);
  } catch (_) { /* non-fatal */ }

  return result;
};
