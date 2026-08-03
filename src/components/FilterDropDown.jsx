import React from 'react';

const FilterDropdown = () => {
  return (
    <select className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-slate-200 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-purple-500 cursor-pointer">
      <option value="All">All</option>
      <option value="Active">Active</option>
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
    </select>
  );
};

export default FilterDropdown;