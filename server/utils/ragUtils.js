import  supabase  from "./supabaseClient.js";
import { getEmbeddings } from "./embeddings.js";
import { v4 as uuidv4 } from "uuid";

// ultra-light chunker
export const chunkText = (text, size = 700) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

export const indexDocumentText = async (text, metadata) => {
  const docId = uuidv4();
  const chunks = chunkText(text);
  const embeddings = await getEmbeddings(chunks);

  const rows = chunks.map((chunk, i) => ({
    id: uuidv4(),
    doc_id: docId,
    content: chunk,
    metadata: { ...metadata, doc_id: docId },
    embedding: embeddings[i]
  }));

  const { error } = await supabase.from("documents").insert(rows);
  if (error) throw error;

  return { docId, chunks: rows.length };
};

export const queryVectorsGrouped = async (queryEmbedding, sessionId, topK = 5) => {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: topK,
    filter_session: sessionId
  });

  if (error) throw error;

  const grouped = {};
  for (const row of data) {
    if (!grouped[row.doc_id]) {
      grouped[row.doc_id] = {
        doc_id: row.doc_id,
        filename: row.metadata?.filename,
        chunks: []
      };
    }
    grouped[row.doc_id].chunks.push({
      content: row.content,
      score: row.score
    });
  }

  return Object.values(grouped);
};
