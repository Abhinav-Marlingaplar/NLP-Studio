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
 * Get most recent history entries for the logged-in user
 */
export const getHistory = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const history = await History.aggregate([
      // 1. Match only this user's history
      { $match: { userId } },

      // 2. Sort newest first (single sort — duplicate removed)
      { $sort: { createdAt: -1 } },

      // 3. Limit to last 10 entries
      { $limit: 10 },

      // 4. Return only the fields the frontend needs
      {
        $project: {
          type: 1,
          input: 1,
          output: 1,
          sessionId: 1,
          createdAt: 1
        }
      }
    ]);

    res.json({ history });
  } catch (err) {
    next(err);
  }
};