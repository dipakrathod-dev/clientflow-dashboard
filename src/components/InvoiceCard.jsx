import React from 'react';

export default function InvoiceCard({ invoice }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Overdue':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const statusBadgeClass = getStatusBadge(invoice.status);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 flex flex-col justify-between gap-5">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
            {invoice.id}
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-medium border rounded-full ${statusBadgeClass}`}>
            {invoice.status}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mt-3">{invoice.client}</h3>
        <p className="text-sm text-slate-400 mt-0.5">{invoice.project}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div>
          <span className="text-xs text-slate-400">Amount</span>
          <p className="text-lg font-bold text-white mt-0.5">₹{invoice.amount?.toLocaleString('en-IN')}</p>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{invoice.paymentMethod}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Due Date</span>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">{invoice.dueDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button className="flex-1 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-200">
          View
        </button>
        <button className="flex-1 py-2 text-xs font-semibold text-violet-300 bg-violet-600/20 hover:bg-violet-600 hover:text-white border border-violet-500/30 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5">
          <span>📄</span> Download PDF
        </button>
      </div>
    </div>
  );
}