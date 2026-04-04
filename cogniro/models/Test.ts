import mongoose, { Schema, model, models } from "mongoose";

const TestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    type: String,
    difficulty: String,
    totalQuestions: Number,
    score: Number,
  },
  { timestamps: true }
);

export default models.Test || model("Test", TestSchema);
