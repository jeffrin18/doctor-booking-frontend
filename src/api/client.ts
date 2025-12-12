import axios from 'axios';

// This points to your running Backend
const apiClient = axios.create({
    baseURL: 'https://doctor-api-0y7t.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;