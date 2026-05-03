'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import DashboardShell from './DashboardShell';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
