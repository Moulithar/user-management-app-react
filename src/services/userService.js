import { api } from '../config/api';

export const fetchUsers = async (page = 1) => {
  try {
    const response = await api.get(`/users?page=${page}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch users'
    };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create user'
    };
  }
};

export const updateUser = async (id, updates) => {
  try {
    const response = await api.put(`/users/${id}`, updates);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update user'
    };
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to delete user'
    };
  }
};
