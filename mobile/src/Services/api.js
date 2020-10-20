import axios from 'axios';

const api = axios.create({
    baseURL : 'http://172.17.0.10:3030'
});

export default api;