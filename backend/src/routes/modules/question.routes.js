import { Router } from "express";
import { scheduleAiFallbackJob } from "../../jobs/ai-answer.job.js";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import { Question } from "../../models/Question.js";
import { User } from "../../models/User.js";
import { buildAiSummaryPrompt, buildDuplicateSearchPayload } from "../../services/ai.service.js";
import { findDuplicateQuestions, prepareQuestionDocument } from "../../services/search.service.js";

export const questionRouter = Router();

questionRouter.get("/", optionalAuth, async (_req, res) => {
  const questions = await Question.find({}, { title: 1, body: 1, tags: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  res.json({ questions });
});

questionRouter.post("/", requireAuth, async (req, res) => {
  const user = await User.findOne({ firebaseUid: req.user.uid }).lean();

  if (!user) {
    return res.status(404).json({ message: "Authenticated user is not synced yet." });
  }

  const questionPayload = await prepareQuestionDocument(req.body, user._id);
  const question = await Question.create(questionPayload);
  const duplicateMatches = await findDuplicateQuestions(req.body.title ?? "");
  const duplicateSearch = buildDuplicateSearchPayload(req.body.title ?? "");
  const aiJob = scheduleAiFallbackJob(String(question._id));

  res.status(201).json({
    message: "Question created and indexed for search.",
    question,
    duplicateSearch,
    duplicateMatches,
    aiJob
  });
});

questionRouter.get("/:questionId", async (req, res) => {
  const question = await Question.findById(req.params.questionId).lean();

  if (!question) {
    return res.status(404).json({ message: "Question not found." });
  }

  const aiPrompt = buildAiSummaryPrompt({
    title: question.title,
    contextChunks: [
      "Curated senior roadmap with arrays, strings, recursion, and weekly revision.",
      "Past accepted answer emphasizing small daily consistency targets."
    ]
  });

  res.json({
    question,
    aiPrompt
  });
});
