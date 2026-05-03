'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { getSocket } from '@/lib/socket';
export type Tag = {
  id: string;
  name: string;
  color: string;
};

type StatusFilter =
  | 'TODAS'
  | 'UNREAD'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED';

type DashboardContextType = {
  tags: Tag[];
  loadingTags: boolean;
  fetchTags: () => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  conversations: any[];
setConversations: React.Dispatch<React.SetStateAction<any[]>>;

  // 🔥 ADICIONAR
  statusFilter: StatusFilter;
  setStatusFilter: React.Dispatch<React.SetStateAction<StatusFilter>>;

  activeTag: string | null;
  setActiveTag: React.Dispatch<React.SetStateAction<string | null>>;

  inboxCounts: {
    total: number;
    unread: number;
    open: number;
    inProgress: number;
    resolved: number;
  };
  setInboxCounts: React.Dispatch<
    React.SetStateAction<{
      total: number;
      unread: number;
      open: number;
      inProgress: number;
      resolved: number;
    }>
  >;
    tagModalOpen: boolean;
  setTagModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


const DashboardContext = createContext({} as DashboardContextType);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // 🔥 NOVOS ESTADOS GLOBAIS

const [statusFilter, setStatusFilter] =
  useState<StatusFilter>('TODAS');

const [activeTag, setActiveTag] =
  useState<string | null>(null);

const [inboxCounts, setInboxCounts] = useState({
  
  total: 0,
  unread: 0,
  open: 0,
  inProgress: 0,
  resolved: 0,
});

const [tagModalOpen, setTagModalOpen] = useState(false);

  async function fetchTags() {
    try {
      const { data } = await axios.get('/tags');
      setTags(data);
    } catch (err) {
      console.error('Erro ao buscar tags');
    } finally {
      setLoadingTags(false);
    }
  }

  async function deleteTag(id: string) {
    await axios.delete(`/tags/${id}`);
    setTags(prev => prev.filter(tag => tag.id !== id));
  }

  useEffect(() => {
    fetchTags();
  }, []);

useEffect(() => {
  const socket = getSocket();

  socket.on('tagDeleted', ({ tagId }) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  });

  return () => {
    socket.off('tagDeleted');
  };
}, []);

  return (
    
   <DashboardContext.Provider
value={{
  tags,
  loadingTags,
  fetchTags,
  deleteTag,

  conversations,
setConversations,

  statusFilter,
  setStatusFilter,

  activeTag,
  setActiveTag,

  inboxCounts,
  setInboxCounts,

  tagModalOpen,
  setTagModalOpen,

  
}}
>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
