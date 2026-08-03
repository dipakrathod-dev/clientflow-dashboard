import React, { useState } from 'react';
import { clients as initialClients } from './data/clients';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import ClientCard from './components/ClientCard';
import ActionButton from './components/ActionButton';
import EmptyState from './components/EmptyState';

function App() {
  const [clientList, setClientList] = useState(initialClients);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Clients</h1>
            <p className="text-sm text-slate-400 mt-1">Manage all your freelance clients</p>
          </div>
          <ActionButton text="Add Client" icon="+" variant="primary" />
        </header>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:flex-1">
            <SearchBar />
          </div>
          <FilterDropdown />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientList.length > 0 ? (
            clientList.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

      </div>
    </div>
  );
}

export default App;