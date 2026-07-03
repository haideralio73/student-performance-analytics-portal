/**
 * utils/constants.js — Client-side constants.
 *
 * Mirrors server constants and adds UI-specific values
 * like route paths and role display labels.
 */

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  student: 'Student',
  teacher: 'Teacher',
  admin: 'Administrator',
};

export const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/students', label: 'Students', roles: ['admin', 'teacher'] },
  { to: '/grades', label: 'Grades' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];
