import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Active: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}