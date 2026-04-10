import { Router } from "express";

export const resourceRouter = Router();

resourceRouter.get("/", (_req, res) => {
  res.json({ message: "Return resources by branch, year, subject, and ranking." });
});

resourceRouter.post("/", (_req, res) => {
  res.status(201).json({ message: "Upload resource metadata and queue preview extraction." });
});
