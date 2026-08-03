import { motion } from "framer-motion";

export default function SectionCard({ title, icon, actionText, onActionClick, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        {title && (
          <div className="flex items-center space-x-2">
            {icon && <span className="text-lg">{icon}</span>}
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
        )}
        {actionText && (
          <button
            onClick={onActionClick}
            className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-md border border-purple-500/20"
          >
            {actionText}
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
}