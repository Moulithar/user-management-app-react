import { api } from '../config/api';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      
      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        // Store user email for display purposes
        localStorage.setItem('userEmail', email);
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'No token received' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  },

  logout() {
    // Clear all auth related data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberedUser');
  },

  getCurrentUser() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (!token) return null;
    
    return { email };
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
