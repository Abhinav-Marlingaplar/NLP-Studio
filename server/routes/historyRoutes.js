import express from "express";
import auth from "../middleware/auth.js";
import { addHistory, getHistory } from "../controllers/historyController.js";

const router = express.Router();

router.post("/add", auth, addHistory);
router.get("/get", auth, getHistory);

export default router;
