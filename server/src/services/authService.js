/**
 * services/authService.js — Authentication business logic.
 *
 * Encapsulates password hashing, token generation, and
 * credential validation so controllers stay thin.
 */

export const hashPassword = async (password) => {
  // Delegate to the User model's pre-save hook or call bcrypt directly
};

export const validateCredentials = async (user, candidatePassword) => {
  return user.comparePassword(candidatePassword);
};
