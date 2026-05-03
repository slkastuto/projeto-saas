import { ReactNode } from 'react';
import Image from 'next/image';
import { Logo } from '@/components/ui/Logo';

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* FUNDO (IMAGEM ORIGINAL) */}
      <Image
        src="/login-bg.png"   // ⬅️ use aqui o fundo que você já tinha
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* OVERLAY (opcional, ajuda no contraste) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTEÚDO */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* LOGO (VERSÃO AUTH) */}
        <div className="flex justify-center mb-8">
          <Logo variant="auth" size="xxl" />
        </div>

        {children}
      </div>
    </div>
  );
}
