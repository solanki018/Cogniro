import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: "Test" },
  question: String,
  options: [String],
  correctAnswer: String,
  explanation: String,
  topic: String,
});

export default models.Question || model("Question", QuestionSchema);
