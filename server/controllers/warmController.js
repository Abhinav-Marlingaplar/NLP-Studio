import { warmAllServices } from "../utils/warmUtils.js";

export const warmAll = async (req, res) => {
  try {
    await warmAllServices();
    res.json({ success: true, message: "All services warmed successfully" });
  } catch (err) {
    console.error("WARM ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
