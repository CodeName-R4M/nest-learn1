import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://diary-back.vercel.app';

const api = axios.create({
  baseURL: API_URL,
});
console.log("🚀 Frontend is calling backend at:", API_URL);

// Add auth token to requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth API
export const register = async ({ email, password, displayName }) => {
  const response = await api.post('/api/auth/register', { email, password, displayName });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// GitHub OAuth
export const initiateGitHubLogin = () => {
  // Redirect to backend's GitHub OAuth initiation endpoint
  window.location.href = `${API_URL}/api/auth/github`;
};

// Diary API calls
export const createDiaryEntry = async (formData) => {
  const response = await api.post('/api/diary/entries', formData);
  return response.data;
};

export const getDiaryEntries = async () => {
  const response = await api.get('/api/diary/entries');
  return response.data;
};

export const getDiaryEntry = async (id) => {
  const response = await api.get(`/api/diary/entries/${id}`);
  return response.data;
};

export const deleteDiaryEntry = async (id) => {
  const response = await api.delete(`/api/diary/entries/${id}`);
  return response.data;
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  // Convert /uploads/filename to /api/uploads/filename for secure endpoint
  if (imageUrl.startsWith('/uploads/')) {
    return imageUrl.replace('/uploads/', '/api/uploads/');
  }
  return imageUrl;
};

export default api;

