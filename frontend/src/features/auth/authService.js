import axios from 'axios';
import jwt_decode from 'jwt-decode';

// The base URL for our backend API
const API_URL = '/api/auth/';

// Create an Axios instance for our API
const api = axios.create({
  baseURL: API_URL,
});

/**
 * @desc    Register user
 * @param   {object} userData - The user's registration data (username, email, password)
 * @returns {object} The user object and token
 */
const register = async (userData) => {
  const response = await api.post('register', userData);

  if (response.data) {
    // Store the token in localStorage so the user stays logged in
    localStorage.setItem('token', JSON.stringify(response.data.token));
  }

  return response.data;
};

/**
 * @desc    Login user
 * @param   {object} userData - The user's login data (email, password)
 * @returns {object} The user object and token
 */
const login = async (userData) => {
  const response = await api.post('login', userData);

  if (response.data) {
    localStorage.setItem('token', JSON.stringify(response.data.token));
  }

  return response.data;
};

/**
 * @desc    Logout user
 * Removes the token from localStorage
 */
const logout = () => {
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
