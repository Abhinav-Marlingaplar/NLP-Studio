import mongoose from "mongoose";
import History from "../models/History.js";

/**
 * Save history entry
 */
export const addHistory = async (req, res, next) => {
  try {
    const { type, input, output, meta } = req.body;

    if (!type || !input || !output) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await History.create({
      userId: req.userId,
      type,
      input,
      output,
      meta
    });

    res.json({ message: "Saved to history" });
  } catch (err) {
    next(err);
  }
};

/**
 * Get most recent services used (one per type)
 */
export const getHistory = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const history = await History.aggregate([
      // 1️ Match user
      { $match: { userId } },

      // 2️ Sort newest first
      { $sort: { createdAt: -1 } },

      // 3 Sort services by most recent usage
      { $sort: { createdAt: -1 } },

      // 4 Limit number of services shown
      { $limit: 5 }
    ]);

    res.json({ history });
  } catch (err) {
    next(err);
  }
};
