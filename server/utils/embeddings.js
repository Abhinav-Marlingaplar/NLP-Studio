import { pipeline } from "@xenova/transformers";

let embedder;

export const getEmbeddings = async (texts = []) => {
  if (!embedder) {
    console.log("Loading MiniLM embedding model...");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { quantized: true } // ✅ IMPORTANT
    );
    console.log("Embedding model ready.");
  }

  const CONCURRENCY = 4; // ✅ safe for Node + WASM
  const embeddings = [];

  for (let i = 0; i < texts.length; i += CONCURRENCY) {
    const batch = texts.slice(i, i + CONCURRENCY);

    const outputs = await Promise.all(
      batch.map(text =>
        embedder(text, {
          pooling: "mean",
          normalize: true
        })
      )
    );

    for (const output of outputs) {
      embeddings.push(Array.from(output.data));
    }
  }

  return embeddings;
};
