import React from 'react';
import ActionButton from './ActionButton';

const EmptyState = ({ onAddClient }) => {
  return (
    <div className="col-span-full border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/40 flex flex-col items-center justify-center space-y-3">
      <div className="text-4xl">👋</div>
      <h3 className="text-lg font-semibold text-slate-200">No Clients Yet</h3>
      <p className="text-sm text-slate-400 max-w-sm">
        Start by adding your first client to manage your freelance workload effectively.
      </p>
      <div className="pt-2">
        <ActionButton text="+ Add Client" variant="primary" onClick={onAddClient} />
      </div>
    </div>
  );
};

export default EmptyState;