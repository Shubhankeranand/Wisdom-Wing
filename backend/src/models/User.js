import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    firebaseUid: { type: String, unique: true, sparse: true },
    passwordHash: String,
    college: String,
    graduationYear: Number,
    bio: String,
    avatarUrl: String,
    skills: [String],
    links: {
      github: String,
      portfolio: String,
      linkedin: String
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    roles: {
      type: [String],
      default: ["student"]
    }
  },
  { timestamps: true }
);

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
