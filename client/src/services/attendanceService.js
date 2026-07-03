/**
 * services/attendanceService.js — Attendance API call wrappers.
 */

import api from './api';

export const getAttendance = (params) => api.get('/attendance', { params });
export const createAttendance = (data) => api.post('/attendance', data);
export const bulkCreateAttendance = (data) => api.post('/attendance/bulk', data);
export const updateAttendance = (id, data) => api.put(`/attendance/${id}`, data);
