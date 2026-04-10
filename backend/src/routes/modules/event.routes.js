import { Router } from "express";

export const eventRouter = Router();

eventRouter.get("/", (_req, res) => {
  res.json({ message: "Return upcoming events with RSVP counts and filters." });
});
