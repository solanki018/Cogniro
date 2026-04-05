import mongoose, { Schema, model, models } from "mongoose";

const MistakeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    selectedAnswer: {
      type: String,
      default: "",
    },

    correctAnswer: {
      type: String,
      required: true,
    },
explanation: {
  type: String,
  default: "",
},
    topic: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

export default models.Mistake || model("Mistake", MistakeSchema);
