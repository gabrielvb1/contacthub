
import axios from 'axios';

const API_URL = 'http://localhost:3033'

export const api = axios.create({
  baseURL: API_URL
});


 const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const initializeAxios = () => {
  const token = localStorage.getItem('authToken');
  return setAuthToken(token); // Configura o token no axios para todas as requisições
};

