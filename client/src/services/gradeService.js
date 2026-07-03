/**
 * services/gradeService.js — Grade API call wrappers.
 */

import api from './api';

export const getGrades = (params) => api.get('/grades', { params });
export const getGradeById = (id) => api.get(`/grades/${id}`);
export const createGrade = (data) => api.post('/grades', data);
export const updateGrade = (id, data) => api.put(`/grades/${id}`, data);
export const deleteGrade = (id) => api.delete(`/grades/${id}`);
