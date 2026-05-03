import express from "express";
import { warmAll } from "../controllers/warmController.js";

const router = express.Router();

router.get("/warm-all", warmAll);
router.get("/health", (req, res) => res.send("OK"));

export default router;
