import mongoose, { Schema, model, models } from "mongoose";

const PerformanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    avgScore: Number,
    weakTopics: [String],
    improvementRate: Number,
  },
  { timestamps: true }
);

export default models.Performance ||
  model("Performance", PerformanceSchema);
