import { Router } from "express";

export const communityRouter = Router();

communityRouter.get("/", (_req, res) => {
  res.json({ message: "List joined communities and discoverable college networks." });
});
