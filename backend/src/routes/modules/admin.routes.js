import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/roles.js";
import { Community } from "../../models/Community.js";
import { Event } from "../../models/Event.js";
import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";

export const adminRouter = Router();

function canManageCommunity(user, community) {
  return (
    user.roles?.includes("superadmin") ||
    community.adminIds?.some((adminId) => String(adminId) === String(user._id))
  );
}

adminRouter.get("/overview", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  const communities = await Community.find({ adminIds: req.currentUser._id })
    .populate("joinRequests.userId", "fullName username college status")
    .lean();

  const communityIds = communities.map((community) => community._id);
  const [posts, events] = await Promise.all([
    Post.find({ communityId: { $in: communityIds } })
      .populate("authorId", "username fullName status")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    Event.find({ communityId: { $in: communityIds } }).sort({ startsAt: 1 }).lean()
  ]);

  res.json({
    communities: communities.map((community) => ({
      ...community,
      memberCount: community.memberIds?.length ?? 0,
      activePosts: posts.filter((post) => String(post.communityId) === String(community._id)).length
    })),
    posts,
    events
  });
});

adminRouter.patch("/communities/:communityId/join-requests/:userId", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  const { action } = req.body;
  const community = await Community.findById(req.params.communityId);

  if (!community) {
    return res.status(404).json({ message: "Community not found." });
  }

  if (!canManageCommunity(req.currentUser, community)) {
    return res.status(403).json({ message: "You cannot manage this community." });
  }

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Action must be approve or reject." });
  }

  const joinRequest = community.joinRequests.find(
    (request) => String(request.userId) === String(req.params.userId) && request.status === "pending"
  );

  if (!joinRequest) {
    return res.status(404).json({ message: "Pending join request not found." });
  }

  joinRequest.status = action === "approve" ? "approved" : "rejected";
  joinRequest.reviewedAt = new Date();

  if (action === "approve") {
    community.memberIds.addToSet(req.params.userId);
    await User.findByIdAndUpdate(req.params.userId, { $addToSet: { joinedCommunities: community._id } });
  }

  await community.save();

  res.json({ message: `Join request ${action}d.` });
});

adminRouter.delete("/posts/:postId", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  const community = await Community.findById(post.communityId);

  if (!community || !canManageCommunity(req.currentUser, community)) {
    return res.status(403).json({ message: "You cannot moderate this post." });
  }

  await post.deleteOne();
  res.json({ message: "Post deleted." });
});

adminRouter.post("/communities/:communityId/events", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  const community = await Community.findById(req.params.communityId);
  const { title, description, startsAt, link } = req.body;

  if (!community) {
    return res.status(404).json({ message: "Community not found." });
  }

  if (!canManageCommunity(req.currentUser, community)) {
    return res.status(403).json({ message: "You cannot manage this community." });
  }

  const event = await Event.create({
    communityId: community._id,
    creatorId: req.currentUser._id,
    title,
    description,
    startsAt: new Date(startsAt),
    link
  });

  res.status(201).json({ event });
});

adminRouter.patch("/events/:eventId", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const community = await Community.findById(event.communityId);

  if (!community || !canManageCommunity(req.currentUser, community)) {
    return res.status(403).json({ message: "You cannot edit this event." });
  }

  for (const field of ["title", "description", "link"]) {
    if (req.body[field] !== undefined) event[field] = req.body[field];
  }

  if (req.body.startsAt) event.startsAt = new Date(req.body.startsAt);

  await event.save();
  res.json({ event });
});

adminRouter.delete("/events/:eventId", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const community = await Community.findById(event.communityId);

  if (!community || !canManageCommunity(req.currentUser, community)) {
    return res.status(403).json({ message: "You cannot delete this event." });
  }

  await event.deleteOne();
  res.json({ message: "Event deleted." });
});
