import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export { axiosPublic, axiosPrivate };
