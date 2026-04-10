import { Router } from "express";

export const adminRouter = Router();

adminRouter.get("/overview", (_req, res) => {
  res.json({ message: "Return moderation metrics, verification queue, and AI logs." });
});
