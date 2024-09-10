import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (username: string, password: string) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const addTask = async (task: { title: string; description: string; date: string | Date }) => {
  const formattedTask = {
    ...task,
    date: task.date instanceof Date ? task.date.toISOString().split('T')[0] : task.date,
  };
  const response = await api.post('/tasks', formattedTask);
  return response.data;
};

export const updateTask = async (id: number, task: { title: string; description: string; date: string; completed: boolean }) => {
  await api.put(`/tasks/${id}`, task);
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};

export default api;
