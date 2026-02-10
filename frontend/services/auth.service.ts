import { api } from './api';

// ======================
// LOGIN
// ======================
export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  return response.data as {
    access_token: string;
  };
}

// ======================
// REGISTER (MODELO 3)
// ======================
export async function register(
  name: string,
  email: string,
  password: string,
) {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
  });

  return response.data as {
    message: string;
    userId: string;
  };
}
