import { pipeline } from "@xenova/transformers";

let embedder;

export const getEmbeddings = async (texts = []) => {
  if (!embedder) {
    console.log("Loading MiniLM embedding model...");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("Embedding model ready.");
  }

  const embeddings = [];
  for (const text of texts) {
    const output = await embedder(text, {
      pooling: "mean",
      normalize: true
    });
    embeddings.push(Array.from(output.data));
  }

  return embeddings;
};
