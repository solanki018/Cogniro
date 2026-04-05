import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: "Test" },
  question: String,
  options: [String],
  topic: [String],
  correctAnswer: String,
  explanation: String, // Good to have for the results page

   // For user evaluation
  userAnswer: { type: String, default: "" },
  isCorrect: { type: Boolean, default: null },
});

export default models.Question || model("Question", QuestionSchema);