import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    startsAt: { type: Date, required: true },
    link: String,
    attendeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

eventSchema.index({ communityId: 1, startsAt: 1 });

export const Event = mongoose.models.Event ?? mongoose.model("Event", eventSchema);
