import React, { useState, useEffect } from 'react';
import { clients as initialClients } from '../data/clients';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropDown';
import ClientCard from '../components/ClientCard';
import ActionButton from '../components/ActionButton';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import StateCard from '../components/StateCard';

export default function Clients() {
  const [clientList, setClientList] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredClients = clientList.filter((client) => {
    const matchesSearch = client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || client.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id) => {
    setClientList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Clients</h1>
          <p className="text-sm text-slate-400 mt-1">Manage all your freelance clients</p>
        </div>
        <ActionButton text="Add Client" icon="+" variant="primary" />
      </header>

      <StateCard title="Total Client Budget" value="₹90,000" change="+12.5%" />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:flex-1">
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <FilterDropdown value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

    </div>
  );
}