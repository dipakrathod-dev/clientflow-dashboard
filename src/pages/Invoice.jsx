import React, { useState } from 'react';
import { invoicesData } from '../data/invoices';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropDown';
import InvoiceCard from '../components/InvoiceCard';
import ActionButton from '../components/ActionButton';
import EmptyState from '../components/EmptyState';

export default function Invoices() {
  const [invoicesList, setInvoicesList] = useState(invoicesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Overdue', value: 'Overdue' }
  ];

  const totalInvoices = invoicesList.length;
  const paidCount = invoicesList.filter(inv => inv.status === 'Paid').length;
  const pendingCount = invoicesList.filter(inv => inv.status === 'Pending').length;
  const totalRevenue = invoicesList
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const filteredInvoices = invoicesList.filter((invoice) => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          invoice.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || invoice.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Invoices</h1>
          <p className="text-sm text-slate-400 mt-1">Track payments and manage invoices.</p>
        </div>
        <ActionButton text="+ Create Invoice" variant="primary" />
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
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search invoices..."
          />
        </div>
        <FilterDropdown 
          options={filterOptions}
          value={selectedFilter} 
          onChange={(e) => setSelectedFilter(e.target.value)} 
        />
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}