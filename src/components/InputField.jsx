import React from 'react';

export default function InputField({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  describedBy,
  ...inputProps
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : undefined);

  return (
    <div className="space-y-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-slate-300">{label}</label>}
      <input
        id={inputId}
        name={name || inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-white px-4 py-2.5 rounded-xl outline-none transition"
        {...inputProps}
      />
    </div>
  );
}
