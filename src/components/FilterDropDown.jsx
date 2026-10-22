import React from 'react';

const defaultOptions = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
];

const FilterDropdown = ({ options = defaultOptions, value = 'All', onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      aria-label="Filter results"
      className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-slate-200 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
