import { api } from '../config/api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Login failed. Please try again.' 
    };
  }
};
