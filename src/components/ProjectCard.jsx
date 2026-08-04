import React from 'react';

export default function ProjectCard({ project }) {
  const getProgressColor = (progress) => {
    if (progress <= 30) return 'bg-red-500';
    if (progress <= 70) return 'bg-yellow-500';
    return 'bg-violet-500';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const progressColorClass = getProgressColor(project.progress);
  const statusBadgeClass = getStatusBadge(project.status);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 flex flex-col justify-between gap-5">
      
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-white tracking-wide">{project.name}</h3>
          <span className={`px-2.5 py-0.5 text-xs font-medium border rounded-full ${statusBadgeClass}`}>
            {project.status}
          </span>
        </div>
        <p className="text-sm text-slate-400">Client: <span className="text-slate-200 font-medium">{project.client}</span></p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
          <span>Progress</span>
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 border border-slate-700/80 text-[10px] font-bold text-violet-300 shadow-inner">
            {project.progress}%
          </div>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${progressColorClass}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <div>
          <span>Deadline</span>
          <p className="text-slate-200 font-semibold text-sm mt-0.5">{project.deadline}</p>
        </div>
        <div className="text-right">
          <span>Budget</span>
          <p className="text-violet-400 font-bold text-sm mt-0.5">₹{project.budget?.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button className="flex-1 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all duration-200">
          View
        </button>
        <button className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-200">
          Edit
        </button>
      </div>

    </div>
  );
}