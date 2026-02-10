import Image from "next/image";
import { ReactNode } from "react";
import { AppVersion } from "@/components/ui/AppVersion";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        flex-col
        items-center
        justify-center
        bg-cover
        bg-center
        px-4
      "
      style={{ backgroundImage: "url('/login-bg.png')" }}
    >
      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/logo-v2.png"
          alt="AtendaFlow"
          width={420}
          height={120}
          priority
          className="select-none"
        />
      </div>

      {/* Conteúdo (Login / Cadastro / Forgot) */}
      {children}

      {/* Versão do app */}
      <AppVersion />
    </div>
  );
}
