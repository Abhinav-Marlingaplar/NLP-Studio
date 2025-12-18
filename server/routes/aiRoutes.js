import { Router } from "express";
import auth from "../middleware/auth.js";

import { handleChat } from "../controllers/chatController.js";
import { uploadAndIndex } from "../controllers/indexController.js";
import { handleParaphrase } from "../controllers/paraphraseController.js";
import { handleAnalyze } from "../controllers/analyzeController.js";
import { getHistory, addHistory } from "../controllers/historyController.js";

const router = Router();

router.post("/upload", auth, uploadAndIndex);
router.post("/chat", auth, handleChat);
router.post("/paraphrase", auth, handleParaphrase);
router.post("/analyze", auth, handleAnalyze);

router.post("/history", auth, addHistory);
router.get("/history", auth, getHistory);

router.get("/test-embed", async (req, res) => {
    const { getEmbeddings } = await import("../utils/embeddings.js");
    const result = await getEmbeddings(["Hello world from testing!"]);
    res.json({ dim: result[0].length });
  });
  

export default router;