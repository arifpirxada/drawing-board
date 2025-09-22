import axios from "../../lib/axios";

const TOKEN_KEY = 'access_token';

export const tokenStorage = {
    setToken: (token) => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    isTokenExpired: (token) => {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            return true;
        }
    }
};

export const authApi = {
    createUser: async (userData) => {
        const res = await axios.post('/users/register', userData)
        return res.data
    },

    loginUser: async (userData) => {
        const res = await axios.post('/users/login', userData)
        return res.data
    }
}