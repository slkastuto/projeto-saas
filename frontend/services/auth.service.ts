import { api } from './api';

// LOGIN
export async function login(email: string, password: string) {
  const response = await api.post(
    '/auth/login',
    { email, password },
    { withCredentials: true }
  );

  return response.data;
}

// REGISTER
export async function register(
  name: string,
  email: string,
  password: string,
) {
  const response = await api.post(
    '/auth/register',
    { name, email, password },
    { withCredentials: true }
  );

  return response.data;
}

// ME
export async function getMe() {
  const response = await api.get('/auth/me', {
    withCredentials: true,
  });

  return response.data;
}