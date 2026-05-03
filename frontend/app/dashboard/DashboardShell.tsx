'use client';
import DeleteTagModal from '@/components/DeleteTagModal';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { usePathname, useRouter } from 'next/navigation';
import CreateTagModal from '@/components/CreateTagModal';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home as HomeIcon,
  Inbox as InboxIcon,
  Settings,
  Circle,
  Mail,
  CheckCircle,
  Tag,
  Plus,
  LogOut,
} from 'lucide-react';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
const {
  statusFilter,
  setStatusFilter,
  activeTag,
  setActiveTag,
  inboxCounts,
  tags,
  tagModalOpen,
  setTagModalOpen,
  conversations,
  deleteTag,
} = useDashboard();

const [tagToDelete, setTagToDelete] = useState<{
  id: string;
  name: string;
} | null>(null);

const [removingTagId, setRemovingTagId] = useState<string | null>(null);
const [toast, setToast] = useState<{
  message: string;
  type: 'success' | 'error';
} | null>(null);

function getTagCount(tagId: string) {
  return conversations.filter((c: any) =>
    c.tags?.some((t: any) => t.id === tagId)
  ).length;
}

  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === '/dashboard';

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

  function handleLogout() {
    router.push('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
        
        {/* LOGO */}
        <div className="h-16 flex items-center px-6 border-b">
          <Image
            src="/logointerno.png"
            alt="AtendaFlow"
            width={140}
            height={32}
            priority
          />
        </div>

        {/* CONTEÚDO ROLÁVEL */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* MENU PRINCIPAL */}
          <nav className="px-4 py-4 space-y-1 text-sm">
            <NavItem
              icon={HomeIcon}
              label="Home"
              href="/dashboard"
              active={isActive('/dashboard')}
            />
            <NavItem
              icon={InboxIcon}
              label="Inbox"
              href="/dashboard/inbox"
              active={isActive('/dashboard/inbox')}
            />
            <NavItem
              icon={Settings}
              label="Automações"
              href="/dashboard/automacoes"
              active={isActive('/dashboard/automacoes')}
            />
          </nav>

          <div className="border-t my-2" />

          {/* STATUS */}
          <Section title="Status">
            <SideFilter
              icon={Circle}
              label="Todas"
              count={inboxCounts.total}
              active={statusFilter === 'TODAS'}
              onClick={() => setStatusFilter('TODAS')}
            />

            <SideFilter
              icon={Mail}
              label="Não lidas"
              count={inboxCounts.unread}
              active={statusFilter === 'UNREAD'}
              onClick={() => setStatusFilter('UNREAD')}
            />

            <SideFilter
              icon={InboxIcon}
              label="Abertas"
              count={inboxCounts.open}
              active={statusFilter === 'OPEN'}
              onClick={() => setStatusFilter('OPEN')}
            />

            <SideFilter
              icon={CheckCircle}
              label="Finalizadas"
              count={inboxCounts.resolved}
              active={statusFilter === 'RESOLVED'}
              onClick={() => setStatusFilter('RESOLVED')}
            />
          </Section>

          <div className="border-t my-2" />

          {/* TAGS */}
          <Section
            title="Tags"
            action={
              <button
onClick={() => setTagModalOpen(true)}
              className="flex items-center justify-center w-6 h-6 rounded-md 
                           text-gray-500 hover:text-blue-600 
                           hover:bg-gray-200 transition"
              >
                <Plus size={14} />
              </button>
            }
          >
<div className="max-h-[35vh] overflow-y-auto pr-2 space-y-1">

              <SideFilter
                icon={Tag}
                label="Todas as tags"
                count={conversations.length}
                active={activeTag === null}
                onClick={() => setActiveTag(null)}
              />

{tags.map((tag) => (
  <div
    key={tag.id}
className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-300 group min-w-0
  ${
    removingTagId === tag.id
      ? 'opacity-0 -translate-x-4'
      : 'opacity-100 translate-x-0'
  }
  ${
    activeTag === tag.id
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-200'
  }
`}
  >
    {/* Área clicável */}
    <div
      onClick={() =>
        setActiveTag(activeTag === tag.id ? null : tag.id)
      }
      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
    >
      <Tag
        size={16}
        className={
          activeTag === tag.id
            ? 'text-white'
            : 'text-gray-500'
        }
      />

      {/* 🔥 truncate corrigido */}
      <span className="truncate flex-1 min-w-0">
        {tag.name}
      </span>
    </div>

    {/* 🔥 Contador real */}
{getTagCount(tag.id) > 0 && (
  <span
    className="text-xs font-semibold px-2 py-0.5 rounded-full mr-2"
    style={{
      backgroundColor: `${tag.color}20`,
      color: tag.color,
      border: `1px solid ${tag.color}40`,
    }}
  >
    {getTagCount(tag.id)}
  </span>
)}

    {/* Lixeira */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setTagToDelete({ id: tag.id, name: tag.name });
      }}
      className={`ml-1 p-1.5 rounded-md transition ${
        activeTag === tag.id
          ? 'hover:bg-white/20 text-white'
          : 'hover:bg-red-100 text-gray-400 hover:text-red-600'
      }`}
    >
      <Trash2 size={14} />
    </button>
  </div>
))}

            </div>
          </Section>

          {/* BOTÃO SAIR */}
          <div className="mt-auto p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* HEADER SUPERIOR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          
          {!isHome && (
            <div className="flex items-center gap-6">
              <TopNav
                label="Home"
                href="/dashboard"
                icon={HomeIcon}
                active={isActive('/dashboard')}
              />
              <TopNav
                label="Inbox"
                href="/dashboard/inbox"
                icon={InboxIcon}
                active={isActive('/dashboard/inbox')}
              />
              <TopNav
                label="Automações"
                href="/dashboard/automacoes"
                icon={Settings}
                active={isActive('/dashboard/automacoes')}
              />
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm font-medium text-gray-700">
              Lucas Almeida
            </span>

            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              L
            </div>
          </div>
        </header>

        {children}
      </div>
      {tagModalOpen && <CreateTagModal />}

{toast && (
  <div className="fixed inset-0 flex items-center justify-center z-[999] pointer-events-none">
    
    {/* backdrop suave */}
    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-fade-in" />

    {/* toast */}
    <div
      className={`
        relative
        px-6 py-4 rounded-2xl
        bg-white
        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
        border border-emerald-200
        flex items-center gap-3
        text-sm font-medium text-gray-800
        animate-toast-in
      `}
    >
      <CheckCircle className="text-emerald-600" size={18} />
      {toast.message}

      {/* barra de progresso */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-emerald-500 animate-progress rounded-b-2xl" />
    </div>
  </div>
)}

{tagToDelete && (
  <DeleteTagModal
    tagId={tagToDelete.id}
    tagName={tagToDelete.name}
    onClose={() => setTagToDelete(null)}
    onConfirm={async () => {
      const id = tagToDelete.id;

      setRemovingTagId(id);

      setTimeout(async () => {
        await deleteTag(id);
        setRemovingTagId(null);

        setToast({
          message: 'Tag excluída com sucesso',
          type: 'success',
        });

        setTimeout(() => {
          setToast(null);
        }, 2500);
      }, 300);
    }}
  />
)}
</div>
);
}

/* ================= COMPONENTES ================= */

function NavItem({
  icon: Icon,
  label,
  href,
  active,
}: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
        active
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function SideFilter({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-sm ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-700 hover:bg-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={16}
          className={active ? 'text-white' : 'text-gray-500'}
        />
        {label}
      </div>

      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          active
            ? 'bg-white/20 text-white'
            : 'bg-gray-300 text-gray-800'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function Section({
  title,
  children,
  action,
}: any) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase">
          {title}
        </p>

        {action && (
          <div className="opacity-60 hover:opacity-100 transition">
            {action}
          </div>
        )}
      </div>

      <div className="space-y-1">{children}</div>
    </div>
  );
}

function TopNav({
  label,
  href,
  icon: Icon,
  active,
}: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-sm transition ${
        active
          ? 'text-blue-600 font-medium'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}