import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useAsyncState } from '../hooks/useAsyncState';
import ClientCard from '../components/ClientCard';
import DeleteModal from '../components/DeleteModal';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { addClient, deleteClient, getClients, updateClient } from '../utils/clientService';
import { validateClientForm } from '../utils/validation';

const emptyForm = { name: '', email: '', company: '', budget: '', status: 'Active' };

export default function Clients() {
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchClients = useCallback(async () => {
    return currentUser?.uid ? getClients(currentUser.uid) : [];
  }, [currentUser?.uid]);

  const {
    data: clients,
    loading,
    execute: executeFetchClients,
  } = useAsyncState(fetchClients, { initialData: [], initialLoading: true });

  useEffect(() => {
    executeFetchClients().catch(() => {
      toast.error('Could not load clients. Please try again.');
    });
  }, [executeFetchClients]);

  const filteredClients = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return clients;
    return clients.filter((client) =>
      [client.name, client.email, client.company].some((value) =>
        value?.toLowerCase().includes(search)
      )
    );
  }, [clients, searchQuery]);

  const openAddForm = useCallback(() => {
    setEditingClient(null);
    setFormData(emptyForm);
    setErrors({});
    setFormError('');
    setFormOpen(true);
  }, []);

  const openEditForm = useCallback((client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      company: client.company || '',
      budget: client.budget?.toString() || '',
      status: client.status || 'Active',
    });
    setErrors({});
    setFormError('');
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingClient(null);
    setFormData(emptyForm);
    setErrors({});
    setFormError('');
  }, []);

  const handleFieldChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError('');
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!currentUser?.uid) return;

    const validationErrors = validateClientForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setFormError('Please correct the highlighted fields.');
      return;
    }

    setSaving(true);
    const clientData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
      budget: Number(formData.budget),
    };
    try {
      if (editingClient) {
        await updateClient(editingClient.id, clientData);
        toast.success('Client updated.');
      } else {
        await addClient(currentUser.uid, clientData);
        toast.success('Client added.');
      }
      if (mountedRef.current) closeForm();
      await executeFetchClients().catch(() => undefined);
    } catch {
      if (mountedRef.current) setFormError('Could not save this client. Please try again.');
      toast.error('Could not save this client. Please try again.');
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  }, [currentUser?.uid, editingClient, executeFetchClients, formData, closeForm]);

  const handleDelete = useCallback(async () => {
    if (!currentUser?.uid || !deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteClient(deleteTarget.id);
      if (mountedRef.current) setDeleteTarget(null);
      await executeFetchClients().catch(() => undefined);
      toast.success('Client deleted.');
    } catch {
      toast.error('Could not delete this client. Please try again.');
    } finally {
      if (mountedRef.current) setDeleting(false);
    }
  }, [currentUser?.uid, deleteTarget, deleting, executeFetchClients]);

  const handleDeleteRequest = useCallback((clientId) => {
    setDeleteTarget(clients.find((client) => client.id === clientId) || null);
  }, [clients]);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

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

      <SearchBar value={searchQuery} onChange={handleSearchChange} placeholder="Search clients..." />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" aria-label="Loading clients">
          {[0, 1, 2].map((item) => <div key={item} className="h-40 rounded-2xl bg-slate-900 animate-pulse" />)}
        </div>
      ) : filteredClients.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} onEdit={openEditForm} onDelete={handleDeleteRequest} />
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
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" aria-labelledby="client-form-title" aria-busy={saving} noValidate>
            <div className="flex items-center justify-between">
              <h2 id="client-form-title" className="text-xl font-semibold">{editingClient ? 'Edit Client' : 'Add Client'}</h2>
              <button type="button" onClick={closeForm} disabled={saving} className="text-slate-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label="Close">✕</button>
            </div>
            {formError && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{formError}</p>}
            <label className="block text-sm text-slate-300">Name
              <input id="client-name" required maxLength={100} value={formData.name} onChange={handleFieldChange('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'client-name-error' : undefined} className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-white ${errors.name ? 'border-red-500' : 'border-slate-700'}`} />
              {errors.name && <p id="client-name-error" role="alert" className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </label>
            <label className="block text-sm text-slate-300">Email
              <input id="client-email" required type="email" maxLength={254} value={formData.email} onChange={handleFieldChange('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'client-email-error' : undefined} className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-white ${errors.email ? 'border-red-500' : 'border-slate-700'}`} />
              {errors.email && <p id="client-email-error" role="alert" className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </label>
            <label className="block text-sm text-slate-300">Company
              <input id="client-company" required maxLength={120} value={formData.company} onChange={handleFieldChange('company')} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? 'client-company-error' : undefined} className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-white ${errors.company ? 'border-red-500' : 'border-slate-700'}`} />
              {errors.company && <p id="client-company-error" role="alert" className="mt-1 text-xs text-red-400">{errors.company}</p>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm text-slate-300">Budget (₹)
                <input id="client-budget" required type="number" min="0" step="1" value={formData.budget} onChange={handleFieldChange('budget')} aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? 'client-budget-error' : undefined} className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-white ${errors.budget ? 'border-red-500' : 'border-slate-700'}`} />
                {errors.budget && <p id="client-budget-error" role="alert" className="mt-1 text-xs text-red-400">{errors.budget}</p>}
              </label>
              <label className="block text-sm text-slate-300">Status
                <select id="client-status" value={formData.status} onChange={handleFieldChange('status')} aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? 'client-status-error' : undefined} className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-white ${errors.status ? 'border-red-500' : 'border-slate-700'}`}>
                  <option>Active</option><option>Pending</option><option>Completed</option>
                </select>
                {errors.status && <p id="client-status-error" role="alert" className="mt-1 text-xs text-red-400">{errors.status}</p>}
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeForm} disabled={saving} className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
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
        isConfirming={deleting}
      />
    </div>
  );
}
