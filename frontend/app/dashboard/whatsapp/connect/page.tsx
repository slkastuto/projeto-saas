'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';

type StatusType =
  | 'generating'
  | 'waiting_scan'
  | 'connected'
  | 'disconnected';

export default function WhatsAppConnectPage() {
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusType>('generating');
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

const companyId = localStorage.getItem('companyId');

if (!companyId) {
  console.error('❌ companyId ausente');
  return;
}

    // 🔥 força conexão do socket
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = async () => {
      console.log('🟢 Socket conectado:', socket.id);

      // entra na sala da empresa
      socket.emit('join_company', companyId);

      try {
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/whatsapp/connect`,
  {
    method: 'POST',
    credentials: 'include', // 🔥 ESSENCIAL
  },
);

        if (!res.ok) {
          console.error('❌ Erro ao inicializar WhatsApp');
          setStatus('disconnected');
        }
      } catch (err) {
        console.error('❌ Falha ao chamar /whatsapp/connect', err);
        setStatus('disconnected');
      }
    };

    const handleQr = (data: any) => {
      console.log('📱 QR recebido');
      setQr(data.qr);
      setStatus('waiting_scan');
    };

    const handleStatus = (newStatus: StatusType) => {
      console.log('📡 Status:', newStatus);
      setStatus(newStatus);

      if (newStatus === 'connected') {
        setTimeout(() => {
          router.push('/dashboard/inbox');
        }, 2000);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('whatsapp_qr', handleQr);
    socket.on('whatsapp_status', handleStatus);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('whatsapp_qr', handleQr);
      socket.off('whatsapp_status', handleStatus);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[420px] text-center">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Conectar WhatsApp
        </h1>

        <p className="text-gray-500 mb-6">
          Escaneie o QR Code com o WhatsApp do celular que deseja conectar.
        </p>

        {/* GERANDO */}
        {status === 'generating' && (
          <p className="text-blue-600 animate-pulse">
            Gerando QR Code...
          </p>
        )}

        {/* AGUARDANDO SCAN */}
        {status === 'waiting_scan' && qr && (
          <div className="flex flex-col items-center gap-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                qr,
              )}`}
              alt="QR Code"
              className="rounded-lg border"
            />

            <p className="text-sm text-gray-500">
              Abra o WhatsApp → Dispositivos conectados → Escaneie o código.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Gerar novo QR Code
            </button>
          </div>
        )}

        {/* CONECTADO */}
        {status === 'connected' && (
          <p className="text-green-600 font-semibold">
            ✅ WhatsApp conectado! Redirecionando...
          </p>
        )}

        {/* DESCONECTADO */}
        {status === 'disconnected' && (
          <div className="flex flex-col gap-4">
            <p className="text-red-600 font-semibold">
              ❌ Desconectado.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
