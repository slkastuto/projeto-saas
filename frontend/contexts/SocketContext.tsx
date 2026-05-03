'use client';

import { createContext, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = getSocket();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // NÃO desconectar aqui
      // Queremos socket persistente no dashboard
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket deve ser usado dentro de SocketProvider');
  }

  return context;
}
