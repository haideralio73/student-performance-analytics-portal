/**
 * middleware/role.js — Role-based access control (RBAC).
 *
 * Factory function that returns middleware allowing only the
 * specified roles to proceed. Must be used after `protect`.
 *
 * Usage: authorize('admin', 'teacher')
 */

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role '${req.user.role}' is not authorized for this resource` });
    }
    next();
  };
};
