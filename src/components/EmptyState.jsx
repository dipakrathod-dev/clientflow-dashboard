import React, { memo } from 'react';

const EmptyState = memo(function EmptyState({
  title = 'No Clients Yet',
  message = "You haven't added any clients yet.",
  actionLabel = '+ Add First Client',
  onAdd,
}) {
  return (
    <div className="col-span-full py-12 px-6 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center">
      <div aria-hidden="true" className="p-3 bg-slate-800/60 rounded-full text-slate-400 mb-3">
        📂
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">{message}</p>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
});

export default EmptyState;
