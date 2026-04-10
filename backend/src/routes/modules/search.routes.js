import { Router } from "express";
import { runQuestionSearch } from "../../services/search.service.js";

export const searchRouter = Router();

searchRouter.get("/", (_req, res) => {
  res.json({ message: "Perform keyword search and semantic search across entities." });
});

searchRouter.get("/questions", async (req, res) => {
  const query = String(req.query.query ?? "");
  const mode = String(req.query.mode ?? "hybrid");
  const results = await runQuestionSearch(query, mode);

  res.json({
    query,
    mode,
    results
  });
});
