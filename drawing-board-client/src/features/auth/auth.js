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
    authenticateUser: async () => {
        const res = await axios.get("/users/me")
        return res.data
    },

    createUser: async (userData) => {
        const res = await axios.post('/users/register', userData)
        return res.data
    },

    loginUser: async (userData) => {
        const res = await axios.post('/users/login', userData)
        return res.data
    },

    logoutUser: async () => {
        tokenStorage.removeToken()
    },

    searchUsers: async (query) => {
        const res = await axios.get(`/users/search?q=${query}`);
        return res.data;
    },

    getUsersByIdArr: async (idArr) => {
        const res = await axios.post('/users/getUsersByIdArr', { data: idArr });
        return res.data;
    }
}