'use client';

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import axios from '@/lib/axios';

export default function CreateTagModal() {
  const { setTagModalOpen, fetchTags } = useDashboard();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');

  async function handleCreate() {
    if (!name.trim()) return;

    try {
      await axios.post('/tags', { name, color });
      await fetchTags();
      setTagModalOpen(false);
      setName('');
      setColor('#6366f1');
    } catch {
      console.error('Erro ao criar tag');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8 space-y-6">

        {/* Título */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Nova Tag
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Crie uma tag para organizar suas conversas
          </p>
        </div>

        {/* Preview da cor */}
        <div className="flex items-center justify-center">
          <span
            className="text-sm font-semibold px-4 py-2 rounded-full border shadow-sm"
            style={{
              backgroundColor: `${color}20`,
              color: color,
              borderColor: `${color}60`,
            }}
          >
            {name || 'Prévia da Tag'}
          </span>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Nome da tag
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: VIP, Cobrança, Suporte..."
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />
        </div>

        {/* Cor */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Cor da tag
          </label>

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 cursor-pointer"
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => setTagModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={`px-5 py-2 rounded-xl text-sm text-white transition ${
              name.trim()
                ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Criar
          </button>
        </div>

      </div>
    </div>
  );
}