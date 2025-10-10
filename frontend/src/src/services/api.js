// src/services/api.js
// This file talks to your backend server

import axios from 'axios';

// Base URL - where your backend is running
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTHENTICATION APIs
// ==========================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ==========================================
// DONATION APIs
// ==========================================
export const donationAPI = {
  // Restaurant APIs
  createDonation: (formData) => {
    return api.post('/donations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyDonations: () => api.get('/donations/my-donations'),
  deleteDonation: (id) => api.delete(`/donations/${id}`),
  
  // NGO APIs
  getAllDonations: (params) => api.get('/donations', { params }),
  getClaimedDonations: () => api.get('/donations/claimed'),
  claimDonation: (id, data) => api.post(`/donations/${id}/claim`, data),
  completeDonation: (id, data) => api.put(`/donations/${id}/complete`, data),
  
  // Common
  getStats: () => api.get('/donations/stats'),
};

// ==========================================
// ADMIN APIs
// ==========================================
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  verifyUser: (userId) => api.put(`/admin/users/${userId}/verify`),
  toggleUserStatus: (userId, isActive) => 
    api.put(`/admin/users/${userId}/toggle-status`, { isActive }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAllDonations: (params) => api.get('/admin/donations', { params }),
};

export default api;