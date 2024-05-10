import axios from 'axios'
import Store from "../store/index";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});
axiosInstance.interceptors.request.use(
    (config) => {
        const getStore = Store.getState();
        const accessToken = !!getStore.user.user ? getStore.user.user.user_token : null
        config.headers['x-api-key'] = import.meta.env.VITE_API_KEY
        config.headers['ngrok-skip-browser-warning'] = true
        if (accessToken) {
            if (config.headers) config.headers['x-access-token'] = accessToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;