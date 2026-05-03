'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      {/* FUNDO */}
      <Image
        src="/dashboard/fundo.png"
        alt="Fundo"
        fill
        className="object-cover"
        priority
      />

      {/* OVERLAY DE CONTEÚDO */}
      <div className="relative z-10 min-h-[calc(100vh-64px)] flex flex-col justify-center px-16">
        <div className="w-full max-w-7xl mx-auto text-center">
          {/* TEXTO */}
          <h1 className="text-4xl font-semibold text-white mb-4">
            Bem-vindo ao AtendaFlow
          </h1>

          <p className="text-white/90 mb-20 max-w-2xl mx-auto">
            Vamos configurar seu atendimento para você começar a usar o sistema.
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
            {/* CARD 1 */}
            <div className="bg-white rounded-3xl shadow-xl px-12 py-16 flex flex-col items-center text-center border-2 border-green-500 hover:-translate-y-1 transition">
              <Image src="/dashboard/whatsapp.png" alt="WhatsApp" width={160} height={160} className="mb-8" />
              <h3 className="font-semibold text-xl text-gray-800 mb-3">
                Conecte seu WhatsApp
              </h3>
              <p className="text-base text-gray-600 mb-10">
                Conecte um número para começar a receber mensagens.
              </p>
<button
  onClick={() => router.push('/dashboard/whatsapp/connect')}
  className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition"
>
  Conectar agora
</button>
</div>   {/* ← FECHAR CARD 1 AQUI */}
            {/* CARD 2 */}
            <div className="bg-white rounded-3xl shadow-xl px-12 py-16 flex flex-col items-center text-center hover:-translate-y-1 transition">
              <Image src="/dashboard/automation.png" alt="Automação" width={170} height={170} className="mb-8" />
              <h3 className="font-semibold text-xl text-gray-800 mb-3">
                Crie sua primeira automação
              </h3>
              <p className="text-base text-gray-600 mb-10">
                Responda clientes automaticamente com mensagens e fluxos.
              </p>
              <button className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition">
                Criar automação
              </button>
            </div>

            {/* CARD 3 */}
            <div className="bg-white rounded-3xl shadow-xl px-12 py-16 flex flex-col items-center text-center hover:-translate-y-1 transition">
              <Image src="/dashboard/inbox.png" alt="Inbox" width={170} height={170} className="mb-8" />
              <h3 className="font-semibold text-xl text-gray-800 mb-3">
                Acompanhe suas conversas
              </h3>
              <p className="text-base text-gray-600 mb-10">
                Gerencie todas as mensagens em um único lugar.
              </p>
              <button
                onClick={() => router.push('/dashboard/inbox')}
                className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition"
              >
                Ir para inbox
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VERSÃO */}
      <div className="absolute bottom-4 left-6 text-xs text-white/70">
        AtendaFlow · v1.0.0
      </div>
    </div>
  );
}
