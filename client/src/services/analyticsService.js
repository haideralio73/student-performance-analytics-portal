/**
 * services/analyticsService.js — Analytics API call wrappers.
 */

import api from './api';

export const getStudentSummary = (studentId) => api.get(`/analytics/student/${studentId}`);
export const getClassOverview = () => api.get('/analytics/class-overview');
