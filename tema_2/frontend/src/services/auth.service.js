// src/services/auth.service.js
import axios from '../utils/axiosConfig';

const AuthService = {
  login: async (username, password) => {
    const response = await axios.post('/auth/login', { username, password });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;