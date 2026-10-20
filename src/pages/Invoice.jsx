import React, { useCallback, useMemo, useState } from 'react';
import { invoicesData } from '../data/invoices';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropDown';
import InvoiceCard from '../components/InvoiceCard';
import EmptyState from '../components/EmptyState';

const filterOptions = [
  { label: 'All', value: 'All' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Overdue', value: 'Overdue' },
];

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleFilterChange = useCallback((event) => {
    setSelectedFilter(event.target.value);
  }, []);

  const { totalInvoices, paidCount, pendingCount, totalRevenue } = useMemo(() => {
    return invoicesData.reduce((summary, invoice) => {
      summary.totalInvoices += 1;
      if (invoice.status === 'Paid') {
        summary.paidCount += 1;
        summary.totalRevenue += invoice.amount;
      }
      if (invoice.status === 'Pending') summary.pendingCount += 1;
      return summary;
    }, { totalInvoices: 0, paidCount: 0, pendingCount: 0, totalRevenue: 0 });
  }, []);

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase();

    return invoicesData.filter((invoice) => {
      const matchesSearch = invoice.id.toLowerCase().includes(normalizedSearch) ||
                            invoice.client.toLowerCase().includes(normalizedSearch) ||
                            invoice.project.toLowerCase().includes(normalizedSearch);
      const matchesFilter = selectedFilter === 'All' || invoice.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Invoices</h1>
          <p className="text-sm text-slate-400 mt-1">Sample invoices for the dashboard preview.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Invoices</p>
          <h2 className="text-2xl font-bold text-white mt-2">{totalInvoices}</h2>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paid</p>
          <h2 className="text-2xl font-bold text-emerald-400 mt-2">{paidCount}</h2>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending</p>
          <h2 className="text-2xl font-bold text-amber-400 mt-2">{pendingCount}</h2>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Revenue</p>
          <h2 className="text-2xl font-bold text-violet-400 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:flex-1">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search invoices..."
          />
        </div>
        <FilterDropdown 
          options={filterOptions}
          value={selectedFilter}
          onChange={handleFilterChange}
        />
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching invoices"
          message="Try a different search term or payment status filter."
        />
      )}
    </div>
  );
}
