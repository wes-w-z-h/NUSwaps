import axios from 'axios';

let BASE_URL = '';

if (import.meta.env.DEV) {
  BASE_URL = import.meta.env.VITE_BACKEND_URL_LOCAL;
} else {
  BASE_URL = import.meta.env.VITE_BACKEND_URL;
}

const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export { BASE_URL, axiosPublic, axiosPrivate };
