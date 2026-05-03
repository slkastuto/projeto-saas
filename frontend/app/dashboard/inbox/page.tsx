'use client';
import { useSocket } from '@/contexts/SocketContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useEffect, useRef, useState } from 'react';
import api from '@/lib/axios';
import {
  Search,
  Send,
  Users,
  MoreVertical,
  Pencil,
  Check,
  RotateCcw,
  Trash2,
  Copy
} from 'lucide-react';

type Tag = {
  id: string;
  name: string;
  color?: string;
};

type Conversation = {
  id: string;
  name?: string;
  contact: string;
  lastMessage?: string;
  lastMessageAt?: string;
  avatarUrl?: string;
  unreadCount?: number;
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  tags?: Tag[]; // 👈 ADICIONE ESSA LINHA
};

type Message = {
  id: string;
  body: string;
  createdAt: string;
  fromMe?: boolean;
  status?: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
};

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150
        ${
          danger
            ? 'text-red-600 hover:bg-red-50'
            : 'text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      <Icon
        size={16}
        strokeWidth={2}
        className={`transition-colors ${
          danger
            ? 'text-red-500 group-hover:text-red-600'
            : 'text-gray-400 group-hover:text-gray-600'
        }`}
      />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace('#', '');

  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function InboxPage() {

  function formatWhatsappText(text: string) {
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<del>$1</del>')
    .replace(/\n/g, '<br/>');
}

const socket = useSocket();

const [copyToast, setCopyToast] = useState(false);
const handleCopyPhone = () => {
  if (!selected?.contact) return;

  navigator.clipboard.writeText(selected.contact);

  setCopyToast(true);

  setTimeout(() => {
    setCopyToast(false);
  }, 1800);
};

const {
  activeTag,
  tags,
  statusFilter,
  setStatusFilter,
  setInboxCounts,
  fetchTags,
  setConversations: setDashboardConversations,
} = useDashboard();


  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  useEffect(() => {
  setDashboardConversations(conversations);
}, [conversations, setDashboardConversations]);

  const [selected, setSelected] = useState<Conversation | null>(null);
const [headerVisible, setHeaderVisible] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef<Conversation | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
const [tagModalOpen, setTagModalOpen] = useState(false);
const [newTagName, setNewTagName] = useState('');
const [newTagColor, setNewTagColor] = useState('#6366f1');
const [tagSelectorOpen, setTagSelectorOpen] = useState(false);
const [tagFilter, setTagFilter] = useState<string | null>(null);

const TAG_COLORS = [
  '#7c3aed', // roxo
  '#2563eb', // azul
  '#16a34a', // verde
  '#eab308', // amarelo
  '#dc2626', // vermelho
  '#ea580c', // laranja
  '#111827', // preto
  '#6b7280', // cinza
];
  

useEffect(() => {
const id = localStorage.getItem('companyId');
  console.log('🏢 company_id carregado:', id);
  setCompanyId(id);
}, []);

useEffect(() => {
  if (!companyId) return;

  const joinRoom = () => {
    console.log('🏢 Entrando na sala:', companyId);
    socket.emit('join_company', companyId);
  };

const handleNewMessage = (message: any) => {
  console.log('📩 FRONT RECEBEU', message);

  // Atualiza mensagens do chat aberto
  if (selectedRef.current?.id === message.conversationId) {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }

  setConversations((prev) => {
    const exists = prev.find(
      (c) => c.id === message.conversationId
    );

    // 🔥 SE NÃO EXISTE, BUSCA A CONVERSA
if (!exists) {
  const newConversation: Conversation = {
    id: message.conversationId,
    name: message.name,
    contact: message.contact,
    avatarUrl: message.avatarUrl || null,
    lastMessage: message.body,
    lastMessageAt: message.createdAt,
    unreadCount: 1,
    status: 'OPEN',
    tags: [],
  };

  return [newConversation, ...prev].sort(
    (a, b) =>
      new Date(b.lastMessageAt || 0).getTime() -
      new Date(a.lastMessageAt || 0).getTime()
  );
}
    const updated = prev.map((c) => {
      if (c.id !== message.conversationId) return c;

      const isOpen =
        selectedRef.current?.id === message.conversationId;

      return {
        ...c,
        lastMessage: message.body,
        lastMessageAt: message.createdAt,
        unreadCount: isOpen
          ? 0
          : (c.unreadCount || 0) + 1,
      };
    });

    // 🔥 REORDENA PARA SUBIR A CONVERSA
    return updated.sort(
      (a, b) =>
        new Date(b.lastMessageAt || 0).getTime() -
        new Date(a.lastMessageAt || 0).getTime()
    );
  });
};

  if (!socket.connected) {
    socket.connect();
  } else {
    joinRoom(); // 🔥 importante se já estiver conectado
  }

  socket.on('connect', joinRoom);
  socket.on('new_message', handleNewMessage);

  return () => {
    socket.off('connect', joinRoom);
    socket.off('new_message', handleNewMessage);
  };
}, [companyId, socket]);

const fetchConversationById = async (conversationId: string) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const res = await fetch(
      `${API_URL}/inbox/${conversationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return;

    const conversation = await res.json();

    setConversations((prev) => {
      if (prev.some((c) => c.id === conversation.id)) return prev;

      return [conversation, ...prev].sort(
        (a, b) =>
          new Date(b.lastMessageAt || 0).getTime() -
          new Date(a.lastMessageAt || 0).getTime()
      );
    });
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
  }
};





useEffect(() => {
  selectedRef.current = selected;
}, [selected]);

useEffect(() => {
  if (!selected) return;

  setHeaderVisible(false);

  const timeout = setTimeout(() => {
    setHeaderVisible(true);
  }, 150);

  return () => clearTimeout(timeout);
}, [selected?.id]);


useEffect(() => {
  const container = messagesContainerRef.current;
  if (!container) return;

  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}, [messages]);




  // ✅ Fecha dropdown ao clicar fora
const menuRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  }

  if (menuOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [menuOpen]);


useEffect(() => {
  async function loadInbox() {
const token = localStorage.getItem('access_token');

const res = await fetch(`${API_URL}/inbox`, {
  credentials: 'include',
});

    const data = await res.json();

    if (Array.isArray(data)) {
      setConversations(data);
      if (data.length > 0) setSelected(data[0]);
    }

    setLoading(false);
  }

  loadInbox();
}, []);

  useEffect(() => {
    if (!selected) return;

    async function loadMessages() {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await fetch(
  `${API_URL}/inbox/messages/${selected.id}`,
  {
    credentials: 'include',
  },
);

      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === selected.id ? { ...c, unreadCount: 0 } : c,
          ),
        );
      } else {
        setMessages([]);
      }
    }

    loadMessages();
  }, [selected]);

const handleSend = async () => {
  if (!input.trim() || !selected || selected.status === 'RESOLVED') return;


  const token = localStorage.getItem('access_token');
  if (!token) return;

  const content = input;
  setInput('');
  const optimisticMessage = {
  id: `temp-${Date.now()}`,
  body: content,
  createdAt: new Date().toISOString(),
  fromMe: true,
  status: 'SENT',
};

setMessages((prev) => [...prev, optimisticMessage]);



setConversations((prev) =>
  prev
    .map((c) =>
      c.id === selected.id
        ? {
            ...c,
            lastMessage: content,
            lastMessageAt: new Date().toISOString(),
            status:
              c.status === 'OPEN'
                ? 'IN_PROGRESS'
                : c.status,
          }
        : c,
    )
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt || 0).getTime() -
        new Date(a.lastMessageAt || 0).getTime(),
    ),
);

////APAGAR ATÉ AQUI  

  try {
    await fetch(`${API_URL}/inbox/messages`, {
      method: 'POST',
headers: {
  'Content-Type': 'application/json',
},
credentials: 'include',
      body: JSON.stringify({
        conversationId: selected.id,
        content,
      }),
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
};



const handleEditName = () => {
  if (!selected) return;

  setEditName(selected.name || '');
  setEditModalOpen(true);
  setMenuOpen(false);
};

const handleSaveName = async () => {
  if (!selected || !editName.trim()) return;

  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    const res = await fetch(
      `${API_URL}/inbox/${selected.id}/name`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName }),
      },
    );

    if (!res.ok) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, name: editName } : c,
      ),
    );

    setSelected((prev) =>
      prev ? { ...prev, name: editName } : prev,
    );

    setEditModalOpen(false);
  } catch (error) {
    console.error(error);
  }
};

const handleFinalizarConversa = async () => {
  if (!selected) return;
 


  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    await fetch(`${API_URL}/inbox/${selected.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
body: JSON.stringify({ status: 'RESOLVED' }),
    });

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, status: 'RESOLVED' } : c
      )
    );

setSelected((prev) =>
  prev ? { ...prev, status: 'RESOLVED' } : prev
);

    setMenuOpen(false);
  } catch (error) {
    console.error(error);
  }
};

const handleReabrirConversa = async () => {
  if (!selected) return;

  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    await fetch(`${API_URL}/inbox/${selected.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'OPEN' }),
    });

    // Atualiza lista lateral
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, status: 'OPEN' } : c
      )
    );

    // Atualiza conversa aberta
    setSelected((prev) =>
      prev ? { ...prev, status: 'OPEN' } : prev
    );

    setMenuOpen(false);
  } catch (error) {
    console.error('Erro ao reabrir conversa:', error);
  }
};

const handleCreateTag = async () => {
  if (!newTagName.trim() || !selected) return;

  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    // 1️⃣ Cria a tag
    const res = await fetch(`${API_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newTagName,
        color: newTagColor,
      }),
    });

    if (!res.ok) return;

    const createdTag = await res.json();

    // 2️⃣ Atualiza lista global de tags

await fetchTags();

    // 3️⃣ 🔥 ATIVA AUTOMATICAMENTE NA CONVERSA
    const currentTagIds =
      selected.tags?.map((t) => t.id) || [];

    const updatedTagIds = [
      ...currentTagIds,
      createdTag.id,
    ];

    await handleUpdateConversationTags(updatedTagIds);

    // 4️⃣ Reset UI
    setNewTagName('');
    setTagModalOpen(false);
    setTagSelectorOpen(false);

  } catch (error) {
    console.error('Erro ao criar tag:', error);
  }
};

const handleDeleteConversation = async () => {
  if (!selected) return;

  const confirmDelete = window.confirm(
    'Tem certeza que deseja excluir esta conversa?'
  );

  if (!confirmDelete) return;

  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    await fetch(`${API_URL}/inbox/${selected.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setConversations((prev) =>
      prev.filter((c) => c.id !== selected.id)
    );

    setSelected(null);
    setMessages([]);
    setMenuOpen(false);

  } catch (error) {
    console.error('Erro ao excluir conversa:', error);
  }
};

const handleUpdateConversationTags = async (tagIds: string[]) => {
  if (!selected) return;

  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    const res = await fetch(
      `${API_URL}/inbox/${selected.id}/tags`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tagIds }),
      }
    );

    if (!res.ok) return;

    const updatedConversation = await res.json();

    // Atualiza conversa aberta
    setSelected(updatedConversation);

    // Atualiza lista lateral
    setConversations((prev) =>
      prev.map((c) =>
        c.id === updatedConversation.id
          ? updatedConversation
          : c
      )
    );
  } catch (error) {
    console.error('Erro ao atualizar tags:', error);
  }
};

/* =======================================================
   📊 CONTADORES DINÂMICOS — COLOCAR EXATAMENTE AQUI
======================================================= */

const totalCount = conversations.length;

const unreadCount = conversations.filter(
  (c) => (c.unreadCount || 0) > 0
).length;

const openCount = conversations.filter(
  (c) => c.status === 'OPEN'
).length;

const inProgressCount = conversations.filter(
  (c) => c.status === 'IN_PROGRESS'
).length;

const resolvedCount = conversations.filter(
  (c) => c.status === 'RESOLVED'
).length;

/* =======================================================
   FIM DOS CONTADORES
======================================================= */

useEffect(() => {
  if (!setInboxCounts) return;

  const total = conversations.length;

  const unread = conversations.filter(
    (c) => (c.unreadCount || 0) > 0
  ).length;

  const open = conversations.filter(
    (c) => c.status === 'OPEN'
  ).length;

  const inProgress = conversations.filter(
    (c) => c.status === 'IN_PROGRESS'
  ).length;

  const resolved = conversations.filter(
    (c) => c.status === 'RESOLVED'
  ).length;

  setInboxCounts({
    total,
    unread,
    open,
    inProgress,
    resolved,
  });
}, [conversations, setInboxCounts]);

if (loading) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <span className="text-gray-400 text-sm">Carregando......Z</span>
    </div>
  );
}

return (
  <div className="flex flex-col h-full min-h-0 bg-gray-50 overflow-hidden">
    {/* TOPBAR */}
<div className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-700">
          <button className="flex items-center gap-2 font-medium text-blue-600">
            <Users size={16} />
            Atendentes
          </button>

          <div className="flex items-center gap-2">
<button
  onClick={() => setStatusFilter('TODAS')}
  className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${
    statusFilter === 'TODAS'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200'
  }`}
>
  Todas
  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
    {totalCount}
  </span>
</button>


<button
  onClick={() => setStatusFilter('OPEN')}
  className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${
    statusFilter === 'OPEN'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200'
  }`}
>
  Abertas
  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
    {openCount}
  </span>
</button>


<button
  onClick={() => setStatusFilter('IN_PROGRESS')}
  className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${
    statusFilter === 'IN_PROGRESS'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200'
  }`}
>
  Em andamento
  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
    {inProgressCount}
  </span>
</button>


<button
  onClick={() => setStatusFilter('RESOLVED')}
  className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${
    statusFilter === 'RESOLVED'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200'
  }`}
>
  Finalizadas
  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
    {resolvedCount}
  </span>
</button>

          </div>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    {/* CONTEÚDO (lista + chat) */}
<div className="flex flex-1 min-h-0 overflow-hidden w-full">
        {/* LISTA */}
<section className="w-80 bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden min-h-0 shadow-sm">
            {conversations
.filter((c) => {

  // 🔥 FILTRO POR TAG PRIMEIRO
if (activeTag && !c.tags?.some(t => t.id === activeTag)) {
      return false;
  }

  if (statusFilter === 'TODAS') return true;

  if (statusFilter === 'UNREAD') {
    return (c.unreadCount || 0) > 0;
  }

  return c.status === statusFilter;
})
          .map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
className={`relative px-4 py-3 cursor-pointer transition-all duration-200 ${
selected?.id === c.id
  ? 'bg-blue-50 shadow-[inset_3px_0_0_0_#2563eb] scale-[1.01]'
    : 'hover:bg-gray-50'
}`}
            >
              <div className="flex gap-3 items-start min-w-0">
<div className={`w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium border transition-all duration-200
  ${
    selected?.id === c.id
      ? 'border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.15)]'
      : 'border-gray-200 bg-gray-200'
  }
`}>                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.name || c.contact}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    c.name?.charAt(0) || c.contact.charAt(0)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">
                      {c.name || c.contact}
                    </p>

                    {c.unreadCount && c.unreadCount > 0 && (
                      <span className="ml-2 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-medium rounded-full bg-blue-600 text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 truncate mt-1">
                    {c.lastMessage || 'Sem mensagens'}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-16 right-4 h-px bg-gray-100" />
            </div>
          ))}
      </section>

      {/* CHAT */}
<main className="flex-1 min-h-0 overflow-hidden flex flex-col transition-all duration-300">
            {/* HEADER DO CHAT */}

<div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between min-h-[96px]">
  {selected ? (
    <>
      {/* ESQUERDA */}
<div
  key={selected.id}
  className={`flex items-center gap-4 min-w-0 flex-1 transition-all duration-300 ${
    headerVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-1'
  }`}
>        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
            {selected.avatarUrl ? (
              <img
                src={selected.avatarUrl}
                alt={selected.name || selected.contact}
                className="w-full h-full object-cover"
              />
            ) : (
              selected.name?.charAt(0) || selected.contact.charAt(0)
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0">

          {/* Nome + Status */}
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-900 text-base truncate">
              {selected.name || selected.contact}
            </h2>

            {selected.status && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                ${
                  selected.status === 'RESOLVED'
                    ? 'bg-gray-100 text-gray-600'
                    : selected.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                
<span
  className={`w-2 h-2 rounded-full ${
    selected.status === 'RESOLVED'
      ? 'bg-gray-400'
      : selected.status === 'IN_PROGRESS'
      ? 'bg-amber-500'
      : 'bg-emerald-500'
  }`}
/>
                
                {selected.status === 'OPEN'
                  ? 'Aberta'
                  : selected.status === 'IN_PROGRESS'
                  ? 'Em andamento'
                  : 'Finalizada'}
              </div>
            )}
          </div>

          {/* Telefone */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">
              {selected.contact}
            </span>

            <button
              onClick={handleCopyPhone}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <Copy size={13} />
            </button>
          </div>

          {/* Tags */}
          {selected.tags && selected.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
{selected.tags.map((tag) => {
  const baseColor = tag.color || '#6366f1';

  return (
    <span
      key={tag.id}
      className="text-[11px] font-semibold px-3 py-1 rounded-full border shadow-sm"
      style={{
        backgroundColor: hexToRgba(baseColor, 0.10),
        color: hexToRgba(baseColor, 0.85),
        borderColor: hexToRgba(baseColor, 0.30),
      }}
    >
      {tag.name}
    </span>
  );
})}
            </div>
          )}

        </div>
      </div>

      {/* DIREITA */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="p-2 rounded-xl hover:bg-gray-100 transition"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </button>

{menuOpen && (
  <div
    ref={menuRef}
    className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50"
  >
    <MenuItem
      icon={Pencil}
      label="Editar contato"
      onClick={handleEditName}
    />

    <MenuItem
      icon={Users}
      label="Gerenciar tags"
      onClick={() => {
        setMenuOpen(false);
        setTagSelectorOpen(true);
      }}
    />

    <div className="my-1 border-t border-gray-100" />

    {selected.status !== 'RESOLVED' && (
      <MenuItem
        icon={Check}
        label="Finalizar conversa"
        onClick={handleFinalizarConversa}
      />
    )}

    {selected.status === 'RESOLVED' && (
      <MenuItem
        icon={RotateCcw}
        label="Reabrir conversa"
        onClick={handleReabrirConversa}
      />
    )}

    <div className="my-1 border-t border-gray-100" />

    <MenuItem
      icon={Trash2}
      label="Excluir conversa"
      onClick={handleDeleteConversation}
      danger
    />
  </div>
)}
       
      </div>
    </>
  ) : (
    <p className="text-gray-400 text-sm">
      Selecione uma conversa
    </p>
  )}
</div>

        {/* MENSAGENS (ÚNICO SCROLL) */}
{selected?.status === 'RESOLVED' && (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl p-10 text-center max-w-lg w-full animate-fade-in">

      <img
        src="/resolved-banner.png"
        alt="Conversa finalizada"
        className="w-64 mx-auto mb-6 animate-float"
      />

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Conversa finalizada
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Esta conversa foi encerrada.
        Reabra para continuar enviando mensagens.
      </p>

      <button
        onClick={handleReabrirConversa}
        className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-green-700 transition active:scale-95"
      >
        Reabrir conversa
      </button>

    </div>
  </div>
)}

<div
  key={selected?.id}
  ref={messagesContainerRef}
  className="flex-1 min-h-0 overflow-y-auto p-8 relative bg-[#f1f5f9] transition-opacity duration-200 animate-fade-in"
>
  {/* Fundo pontilhado suave */}
<div className="absolute inset-0 pointer-events-none opacity-[0.02]">
  <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:28px_28px]" />
</div>

  <div className="relative z-10 space-y-4">
    {messages.map((msg, index) => {
      const safeKey = msg.id ?? `${index}-${msg.body}`;
      const isMe = msg.fromMe;

      return (
<div
  key={safeKey}
  className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
>
          <div
            className={`px-5 py-3 rounded-2xl max-w-md relative transition-all duration-200
              ${
                isMe
                  ? msg.status === 'FAILED'
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-900 border border-emerald-200 shadow-[0_2px_8px_rgba(16,185,129,0.08)]'
: 'bg-white text-gray-800 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'              }
            `}
          >
<p
  className="text-sm whitespace-pre-wrap break-words leading-relaxed"
  dangerouslySetInnerHTML={{
    __html: formatWhatsappText(msg.body),
  }}
/>
            <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-500">
              <span>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {isMe && (
                <>
                  {msg.status === 'SENT' && <span>✓</span>}
                  {msg.status === 'DELIVERED' && <span>✓✓</span>}
                  {msg.status === 'READ' && (
                    <span className="text-blue-500">✓✓</span>
                  )}
                  {msg.status === 'FAILED' && (
                    <span className="text-red-500">!</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>


        {/* INPUT FIXO */}
<div className="p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Digite uma mensagem..."
           className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2 text-sm outline-none focus:bg-white focus:border-gray-300 transition"
          />
<button
  onClick={handleSend}
  disabled={selected?.status === 'RESOLVED'}
  className={`px-4 rounded-xl flex items-center gap-1 transition ${
    selected?.status === 'RESOLVED'
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-green-600 text-white hover:bg-green-700'
  }`}
>
  <Send size={16} />
  Enviar
</button>

        </div>
          </main>
    </div>

{/* MODAL */}
{editModalOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4">

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Editar nome do contato
        </h2>
        <p className="text-sm text-gray-500">
          Atualize o nome exibido nesta conversa
        </p>
      </div>

      <input
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Digite o nome..."
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => setEditModalOpen(false)}
className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition active:scale-95"
        >
          Cancelar
        </button>

        <button
          onClick={handleSaveName}
          className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Salvar
        </button>
      </div>

    </div>
  </div>
)}

{/* TOAST */}
{copyToast && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200]">
    <div className="bg-white text-gray-800 px-6 py-3 rounded-2xl shadow-2xl border border-gray-200 text-sm font-medium flex items-center gap-2">
      <Check size={16} className="text-green-600" />
      Número copiado
    </div>
  </div>
)}

{tagSelectorOpen && selected && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">

      <h2 className="text-lg font-semibold text-gray-900">
        Gerenciar Tags
      </h2>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {tags.map((tag) => {
          const isActive = selected.tags?.some(t => t.id === tag.id);

          return (
            <label
              key={tag.id}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => {
                  let updatedTagIds = selected.tags?.map(t => t.id) || [];

                  if (e.target.checked) {
                    updatedTagIds = [...updatedTagIds, tag.id];
                  } else {
                    updatedTagIds = updatedTagIds.filter(id => id !== tag.id);
                  }

                  handleUpdateConversationTags(updatedTagIds);
                }}
              />

              <span
                className="text-sm font-medium px-2 py-0.5 rounded-full"
style={{
  backgroundColor: hexToRgba(tag.color || '#6b7280', 0.18),
  color: tag.color || '#6b7280',
}}
              >
                {tag.name}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex justify-between pt-3 border-t">
        <button
onClick={() => {
  setTagSelectorOpen(false);
  setTagModalOpen(true);
}}
          className="text-sm text-blue-600"
        >
          + Nova tag
        </button>

<button
  onClick={() => setTagSelectorOpen(false)}
  className="px-4 py-2 rounded-xl bg-gray-800 text-white text-sm hover:bg-gray-900 transition active:scale-95"
>
  Fechar
</button>
      </div>

    </div>
  </div>
)}

{tagModalOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Nova Tag
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Crie uma tag para organizar suas conversas
        </p>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center">
        <span
          className="text-sm font-semibold px-4 py-2 rounded-full border shadow-sm"
          style={{
            backgroundColor: hexToRgba(newTagColor, 0.15),
            color: newTagColor,
            borderColor: hexToRgba(newTagColor, 0.35),
          }}
        >
          {newTagName || "Cor da TAG"}
        </span>
      </div>

      {/* Input nome */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">
          Nome da tag
        </label>

        <input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Ex: VIP, Cobrança, Suporte..."
          className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

{/* Cor */}
<div className="space-y-3">
  <label className="text-xs font-medium text-gray-600">
    Cor da tag
  </label>

  <div className="flex items-center gap-4">
    <div
      className="w-12 h-12 rounded-2xl shadow-sm border border-gray-200"
      style={{ backgroundColor: newTagColor }}
    />

    <div className="flex items-center gap-3 flex-wrap">
      {TAG_COLORS.map((color) => {
        const isActive = newTagColor === color;

        return (
          <button
            key={color}
            type="button"
            onClick={() => setNewTagColor(color)}
            className={`w-8 h-8 rounded-xl transition-all duration-200 border-2
              ${
                isActive
                  ? 'scale-110 ring-2 ring-gray-900 shadow-sm'
                  : 'border-transparent hover:scale-105'
              }
            `}
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  </div>
</div>
     

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={() => setTagModalOpen(false)}
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50 transition active:scale-95"
        >
          Cancelar
        </button>

        <button
          onClick={handleCreateTag}
          disabled={!newTagName.trim()}
          className={`px-5 py-2 rounded-xl text-sm text-white transition active:scale-95 ${
            newTagName.trim()
              ? "bg-blue-600 hover:bg-blue-700 shadow-sm"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Criar tag
        </button>
      </div>

    </div>
  </div>
)}

  </div>
);
}