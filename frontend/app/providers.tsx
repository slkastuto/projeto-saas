'use client';

import { SocketProvider } from '@/contexts/SocketContext';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
}