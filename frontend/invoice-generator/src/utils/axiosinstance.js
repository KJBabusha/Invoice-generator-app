import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 8000, // 8 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Resquest Interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('authToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Response Interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // handle errors globally
        if (error.response) {
            if (error.response.status === 500) {
                console.error("Server Error. Please try again later.");
            }
        }else if(error.code === 'ECONNABORTED'){
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }

);
export default axiosInstance;