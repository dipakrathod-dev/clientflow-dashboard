import { useEffect, useState } from 'react';
import { getClients, deleteClient } from '../utils/clientService';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    await deleteClient(id);
    setClients(clients.filter(c => c.id !== id));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-10 bg-slate-200 animate-pulse rounded"></div>
        <div className="h-10 bg-slate-200 animate-pulse rounded"></div>
        <div className="h-10 bg-slate-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-2xl">👋</p>
        <p className="font-semibold text-lg mt-2">No Clients Yet</p>
        <p className="text-gray-500">Add your first client.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Clients List</h2>
      <div className="space-y-2">
        {clients.map((client) => (
          <div key={client.id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
            <button 
              onClick={() => handleDelete(client.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}