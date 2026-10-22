import React from 'react';

export default function DeleteModal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">Delete {title}?</h3>
        <p className="text-slate-400 text-sm mb-6">
          This action cannot be undone. Are you sure you want to proceed?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}