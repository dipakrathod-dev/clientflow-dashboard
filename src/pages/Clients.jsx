import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import ClientCard from '../components/ClientCard';
import DeleteModal from '../components/DeleteModal';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { addClient, deleteClient, getClients, updateClient } from '../utils/clientService';
import { validateClientForm } from '../utils/validation';

const emptyForm = { name: '', email: '', company: '', budget: '', status: 'Active' };

export default function Clients() {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchClients = useCallback(async () => {
    if (!currentUser?.uid) {
      setClients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setClients(await getClients(currentUser.uid));
    } catch {
      toast.error('Could not load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return clients;
    return clients.filter((client) =>
      [client.name, client.email, client.company].some((value) =>
        value?.toLowerCase().includes(search)
      )
    );
  }, [clients, searchQuery]);

  const openAddForm = () => {
    setEditingClient(null);
    setFormData(emptyForm);
    setFormErrors({});
    setFormOpen(true);
    setFormErrors({});
  };

  const openEditForm = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      company: client.company || '',
      budget: client.budget?.toString() || '',
      status: client.status || 'Active',
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingClient(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser?.uid) return;

    const errors = validateClientForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    const clientData = { ...formData, budget: Number(formData.budget) };
    try {
      if (editingClient) {
        await updateClient(editingClient.id, clientData);
        toast.success('Client updated.');
      } else {
        await addClient(currentUser.uid, clientData);
        toast.success('Client added.');
      }
      closeForm();
      await fetchClients();
    } catch {
      toast.error('Could not save this client. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser?.uid || !deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteClient(deleteTarget.id);
      setClients((previous) => previous.filter((client) => client.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success('Client deleted.');
    } catch {
      toast.error('Could not delete this client. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 animate-fade-in text-white">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-slate-400 mt-1">Keep your client details organized.</p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition"
        >
          + Add Client
        </button>
      </header>

      <SearchBar value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search clients..." />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" aria-label="Loading clients">
          {[0, 1, 2].map((item) => <div key={item} className="h-40 rounded-2xl bg-slate-900 animate-pulse" />)}
        </div>
      ) : filteredClients.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} onEdit={openEditForm} onDelete={() => setDeleteTarget(client)} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={clients.length ? 'No matching clients' : 'No Clients Yet'}
          message={clients.length ? 'Try a different search term.' : "You haven't added any clients yet."}
          onAdd={openAddForm}
        />
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation">
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" aria-labelledby="client-form-title">
            <div className="flex items-center justify-between">
              <h2 id="client-form-title" className="text-xl font-semibold">{editingClient ? 'Edit Client' : 'Add Client'}</h2>
              <button type="button" onClick={closeForm} className="text-slate-400 hover:text-white" aria-label="Close">✕</button>
            </div>
            <label className="block text-sm text-slate-300" htmlFor="client-name">Name
              <input id="client-name" required maxLength={100} value={formData.name} aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? 'client-name-error' : undefined} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
              {formErrors.name && <span id="client-name-error" className="mt-1 block text-xs text-red-300">{formErrors.name}</span>}
            </label>
            <label className="block text-sm text-slate-300" htmlFor="client-email">Email
              <input id="client-email" required type="email" maxLength={254} value={formData.email} aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? 'client-email-error' : undefined} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
              {formErrors.email && <span id="client-email-error" className="mt-1 block text-xs text-red-300">{formErrors.email}</span>}
            </label>
            <label className="block text-sm text-slate-300" htmlFor="client-company">Company
              <input id="client-company" required maxLength={120} value={formData.company} aria-invalid={Boolean(formErrors.company)} aria-describedby={formErrors.company ? 'client-company-error' : undefined} onChange={(event) => setFormData({ ...formData, company: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
              {formErrors.company && <span id="client-company-error" className="mt-1 block text-xs text-red-300">{formErrors.company}</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm text-slate-300" htmlFor="client-budget">Budget (₹)
                <input id="client-budget" required type="number" min="0" step="1" value={formData.budget} aria-invalid={Boolean(formErrors.budget)} aria-describedby={formErrors.budget ? 'client-budget-error' : undefined} onChange={(event) => setFormData({ ...formData, budget: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
                {formErrors.budget && <span id="client-budget-error" className="mt-1 block text-xs text-red-300">{formErrors.budget}</span>}
              </label>
              <label className="block text-sm text-slate-300" htmlFor="client-status">Status
                <select id="client-status" value={formData.status} aria-invalid={Boolean(formErrors.status)} aria-describedby={formErrors.status ? 'client-status-error' : undefined} onChange={(event) => setFormData({ ...formData, status: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white">
                  <option>Active</option><option>Pending</option><option>Completed</option>
                </select>
                {formErrors.status && <span id="client-status-error" className="mt-1 block text-xs text-red-300">{formErrors.status}</span>}
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeForm} className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">
                {saving ? 'Saving...' : editingClient ? 'Save Changes' : 'Add Client'}
              </button>
            </div>
          </form>
        </div>
      )}

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.name || 'client'}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isSubmitting={deleting}
      />
    </div>
  );
}
