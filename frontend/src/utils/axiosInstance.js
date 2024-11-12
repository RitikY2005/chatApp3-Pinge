import axios from 'axios';
import { BACKEND_URL } from '../constants/routes.constants.js';

const axiosInstance = axios.create({
	baseUrl: BACKEND_URL,
	withCredentials: true,
});

export default axiosInstance;
