'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { login } from '@/services/auth.service';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    try {
      setLoading(true);
      setError('');

      const { access_token } = await login(email, password);

      // 🔐 Salva token
      localStorage.setItem('access_token', access_token);

      // ➡️ Redireciona para área logada
      router.push('/dashboard');
    } catch (err) {
      setError('E-mail ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold text-gray-800 text-center mb-1">
          Bem-vindo de volta!
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Acesse sua conta para continuar
        </p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <Input
            label="E-mail"
            type="email"
            placeholder="seuemail@email.com"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <Input
              label="Senha"
              type="password"
              placeholder="************"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-right mt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-purple-600 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading}>
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Ainda não tem uma conta?{' '}
          <Link
            href="/register"
            className="text-green-600 hover:underline"
          >
            Cadastre-se
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}
