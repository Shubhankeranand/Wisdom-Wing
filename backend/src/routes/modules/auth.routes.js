import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { User } from "../../models/User.js";

export const authRouter = Router();

authRouter.post("/signup", (_req, res) => {
  res.status(201).json({ message: "Create account and trigger verification workflow." });
});

authRouter.post("/login", (_req, res) => {
  res.json({ message: "Issue auth token and session metadata." });
});

authRouter.post("/session", requireAuth, async (req, res) => {
  const { uid, email, name, picture } = req.user;
  const { firstName, lastName, graduationYear, avatarUrl } = req.body;

  const user = await User.findOneAndUpdate(
    { firebaseUid: uid },
    {
      $set: {
        firebaseUid: uid,
        email,
        firstName: firstName || name?.split(" ")[0] || "",
        lastName: lastName || name?.split(" ").slice(1).join(" ") || "",
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        avatarUrl: avatarUrl || picture || null
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  res.json({
    message: "Firebase session synced.",
    user: {
      id: user._id,
      email: user.email,
      verificationStatus: user.verificationStatus
    }
  });
});

authRouter.post("/verify-college-id", (_req, res) => {
  res.json({ message: "Upload college ID and enqueue admin verification." });
});
