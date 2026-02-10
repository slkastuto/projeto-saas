'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User } from 'lucide-react';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { register } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await register(name, email, password);

      // ✅ após cadastrar, vai para login
      router.push('/login');
    } catch (err) {
      setError('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold text-gray-800 text-center mb-1">
          Crie sua conta
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Comece a usar o AtendaFlow em poucos minutos
        </p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            icon={<User size={18} />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="seuemail@email.com"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Crie uma senha segura"
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirmar senha"
            type="password"
            placeholder="Digite a senha novamente"
            icon={<Lock size={18} />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Termos */}
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 accent-green-600"
            />
            <span>
              Li e aceito os{' '}
              <a href="#" className="text-green-600 hover:underline">
                Termos de Uso
              </a>{' '}
              e a{' '}
              <a href="#" className="text-green-600 hover:underline">
                Política de Privacidade
              </a>
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <Button type="submit" disabled={!acceptedTerms} loading={loading}>
            Criar conta
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-green-600 hover:underline">
            Entrar
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}
