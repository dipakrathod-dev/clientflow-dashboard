import React from 'react';

export default function InputField({ label, type = 'text', value, onChange, placeholder, required = false }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-white px-4 py-2.5 rounded-xl outline-none transition"
      />
    </div>
  );
}