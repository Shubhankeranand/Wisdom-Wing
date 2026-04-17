import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["post", "resource"],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

replySchema.index({ targetType: 1, targetId: 1, createdAt: 1 });

export const Reply = mongoose.models.Reply ?? mongoose.model("Reply", replySchema);
