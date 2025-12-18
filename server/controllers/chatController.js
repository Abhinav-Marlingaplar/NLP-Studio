import { getGroqClient } from "../utils/groqClient.js";
import { getEmbeddings } from "../utils/embeddings.js";
import { queryVectorsGrouped } from "../utils/ragUtils.js";
import History from "../models/History.js";

export const handleChat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message)
      return res.status(400).json({ message: "Message required" });

    if (!sessionId) {
      return res.json({
        success: true,
        reply:
          "No documents are attached in this session. Please upload PDFs before asking questions.",
        sources: []
      });
    }

    const [queryEmbedding] = await getEmbeddings([message]);
    const docs = await queryVectorsGrouped(queryEmbedding, sessionId);

    if (!docs.length) {
      return res.json({
        success: true,
        reply:
          "The uploaded documents do not contain information related to your question.",
        sources: []
      });
    }

    const context = docs
      .map(
        d =>
          `Document: ${d.filename}\n` +
          d.chunks.map(c => c.content).join("\n")
      )
      .join("\n\n");

    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Answer ONLY using the provided documents. If not found, say you don't know."
        },
        { role: "system", content: "Context:\n" + context },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    await History.create({
      userId: req.userId,
      type: "rag",
      sessionId,
      input: message,
      output: reply
    });

    res.json({
      success: true,
      reply,
      sources: docs.map(d => d.filename)
    });
  } catch (err) {
    next(err);
  }
};
