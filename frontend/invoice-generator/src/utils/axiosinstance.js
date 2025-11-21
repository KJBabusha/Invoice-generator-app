import axios from 'axios';
import { BASE_URL} from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000, // 8 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Resquest Interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
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
// axiosInstance.interceptors.response.use(
    // (response) => {
    //     return response;
    // },
    // (error) => {
    //     // handle errors globally
    //     if (error.response) {
    //         if (error.response.status === 500) {
    //             console.error("Server Error. Please try again later.");
    //         }
    //     }else if(error.code === 'ECONNABORTED'){
    //         console.error("Request timeout. Please try again.");
    //     }
    //     return Promise.reject(error);
    // }
    // ...existing code...
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = {
      message: error?.message || 'Unknown error',
      status: error?.response?.status ?? null,
      data: error?.response?.data ?? null,
      code: error?.code ?? null,
      stack: error?.stack ?? null,
    };

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Axios response error payload:', payload);
    }

    // keep original axios error structure for callers:
    return Promise.reject(error);
  }
// ...existing code...

);
export default axiosInstance;