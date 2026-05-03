import { ragChat } from "../services/ragService.js";
import History from "../models/History.js";

export const handleChat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message)
      return res.status(400).json({ message: "Message required" });

    const { reply, sources } = await ragChat({ message, sessionId, userId: req.userId });

    if (sessionId && reply && !reply.startsWith("No documents")) {
      await History.create({
        userId: req.userId,
        type: "rag",
        sessionId,
        input: message,
        output: reply
      });
    }

    res.json({ success: true, reply, sources });
  } catch (err) {
    next(err);
  }
};
