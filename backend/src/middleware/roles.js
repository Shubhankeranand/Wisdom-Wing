import { getCurrentUser } from "../services/user.service.js";

export function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    const user = await getCurrentUser(req.user.uid);

    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const hasRole = allowedRoles.some((role) => user.roles?.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: "Insufficient permissions." });
    }

    req.currentUser = user;
    return next();
  };
}
