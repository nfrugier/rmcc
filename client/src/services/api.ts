import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // L'adresse de votre API NestJS
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;