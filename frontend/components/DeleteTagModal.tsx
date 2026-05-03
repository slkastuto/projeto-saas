'use client';

import { useEffect, useState } from 'react';

interface Props {
  tagId: string;
  tagName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteTagModal({
  tagId,
  tagName,
  onClose,
  onConfirm,
}: Props) {
  const [visible, setVisible] = useState(false);

  // anima entrada
  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 200);
  }

  function handleConfirm() {
    setVisible(false);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 200);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        visible ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/0'
      }`}
    >
      <div
        className={`bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4 transition-all duration-200 ${
          visible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-2'
        }`}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Excluir tag
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Tem certeza que deseja excluir a tag{' '}
            <span className="font-medium text-gray-800">
              "{tagName}"
            </span>
            ?
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition active:scale-95"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition active:scale-95"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}