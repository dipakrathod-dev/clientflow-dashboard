import React from 'react';

const ActionButton = ({ text, icon, variant = 'primary', onClick }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer";

  const variantStyles = {
    primary: "bg-purple-600 hover:bg-purple-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 active:scale-95",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:scale-105 active:scale-95",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:scale-105 active:scale-95"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary}`}
    >
      {icon && <span className="text-base font-semibold">{icon}</span>}
      {text}
    </button>
  );
};

export default ActionButton;