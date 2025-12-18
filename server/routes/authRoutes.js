import express from "express";
import { register, login, refresh, me, logout } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", auth, me);
router.post("/logout", logout);

export default router;
