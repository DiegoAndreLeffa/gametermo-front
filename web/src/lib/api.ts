import axios from 'axios';

const API_URL = "https://gametermo-api-production.up.railway.app";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('loldle-token') : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Adicione este log para ver o erro real no console do navegador (F12)
    console.error("Erro na API:", error.response);

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // COMENTE ISSO TEMPORARIAMENTE PARA DEBUGAR
        // localStorage.removeItem('loldle-token'); 
        console.warn("Deu 401, mas segurei o token para debug.");
      }
    }
    return Promise.reject(error);
  }
);