import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    body: { type: String, required: true },
    isAiGenerated: { type: Boolean, default: false },
    votes: { type: Number, default: 0 },
    feedbackScore: { type: Number, default: 0 },
    bestAnswerAt: Date
  },
  { timestamps: true }
);

export const Answer = mongoose.models.Answer ?? mongoose.model("Answer", answerSchema);
