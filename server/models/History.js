import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },   // rag / paraphrase / analyze
    input: { type: String, required: true },
    output: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
