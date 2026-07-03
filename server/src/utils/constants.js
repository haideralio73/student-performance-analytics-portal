/**
 * utils/constants.js — Application-wide constants.
 *
 * Central place for role names, assessment types, attendance
 * statuses, pagination defaults, and other magic values.
 */

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

export const ASSESSMENT_TYPES = ['exam', 'quiz', 'assignment', 'project'];

export const ATTENDANCE_STATUSES = ['present', 'absent', 'late', 'excused'];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
