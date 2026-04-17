import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/roles.js";
import { Community } from "../../models/Community.js";
import { CommunityRequest } from "../../models/CommunityRequest.js";
import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";

export const superadminRouter = Router();

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

superadminRouter.use(requireAuth, requireRole("superadmin"));

superadminRouter.get("/overview", async (_req, res) => {
  const [requests, communities, users, totalPosts] = await Promise.all([
    CommunityRequest.find({}).populate("requesterId", "fullName username email").sort({ createdAt: -1 }).lean(),
    Community.find({}).lean(),
    User.find({}, { fullName: 1, username: 1, email: 1, roles: 1, status: 1 }).sort({ createdAt: -1 }).lean(),
    Post.countDocuments()
  ]);

  res.json({
    requests,
    communities: communities.map((community) => ({
      ...community,
      memberCount: community.memberIds?.length ?? 0
    })),
    users,
    stats: {
      totalUsers: users.length,
      totalCommunities: communities.length,
      totalPosts
    }
  });
});

superadminRouter.patch("/community-requests/:requestId", async (req, res) => {
  const { action, rejectionReason } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Action must be approve or reject." });
  }

  const request = await CommunityRequest.findById(req.params.requestId);

  if (!request) {
    return res.status(404).json({ message: "Community request not found." });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request has already been reviewed." });
  }

  request.status = action === "approve" ? "approved" : "rejected";
  request.reviewedBy = req.currentUser._id;
  request.reviewedAt = new Date();
  request.rejectionReason = rejectionReason;

  if (action === "approve") {
    const creator = await User.findById(request.requesterId);
    const community = await Community.create({
      name: request.communityName,
      slug: `${createSlug(request.communityName)}-${Date.now()}`,
      description: request.description,
      type: request.type,
      college: request.collegeName,
      createdBy: creator?._id,
      adminIds: creator ? [creator._id] : [],
      memberIds: creator ? [creator._id] : []
    });

    if (creator) {
      const safeRoles = (creator.roles ?? []).filter((role) => ["user", "admin", "superadmin"].includes(role));
      creator.roles = Array.from(new Set([...safeRoles, "user", "admin"]));
      creator.joinedCommunities.addToSet(community._id);
      await creator.save();
    }

    request.createdCommunityId = community._id;
  }

  await request.save();
  res.json({ request });
});

superadminRouter.patch("/users/:userId/roles", async (req, res) => {
  const roles = Array.isArray(req.body.roles) ? req.body.roles : [];
  const allowedRoles = ["user", "admin", "superadmin"];
  const cleanedRoles = roles.filter((role) => allowedRoles.includes(role));

  if (!cleanedRoles.length) {
    return res.status(400).json({ message: "At least one valid role is required." });
  }

  const user = await User.findByIdAndUpdate(req.params.userId, { roles: cleanedRoles }, { new: true });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({ user });
});
