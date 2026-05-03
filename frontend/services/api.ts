import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export const api = axios.create({
  baseURL,
  withCredentials: true, // 🔥 ESSENCIAL
});