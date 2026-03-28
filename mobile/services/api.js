import axios from 'axios';
import { Platform } from 'react-native';

// For Android emulator, use 10.0.2.2. For iOS or Web, use localhost
const getBaseUrl = () => {
  // Using your local Wi-Fi IP address so your physical mobile phone can reach the backend
  return 'http://10.59.104.34:3000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 5000,
});

export const getDashboard = () => api.get('/dashboard');
export const getCustomers = () => api.get('/customers');
export const getCustomerDetail = (id) => api.get(`/customers/${id}`);
export const sendChatMessage = (message) => api.post('/chat', { message });

export default api;
