/**
 * services/authService.js — Auth API call wrappers.
 * Unwraps the { success, data } envelope from the backend.
 */

import api from './api';

export const loginUser = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data.data;
};

export const registerUser = async (payload) => {
  const res = await api.post('/auth/register', payload);
  return res.data.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.data;
};

export const refreshToken = async () => {
  const res = await api.post('/auth/refresh');
  return res.data.data;
};

export const logoutUser = async () => {
  const res = await api.post('/auth/logout');
  return res.data.data;
};
