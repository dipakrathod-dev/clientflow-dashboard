import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropDown';
import InvoiceCard from '../components/InvoiceCard';
import EmptyState from '../components/EmptyState';
import DeleteModal from '../components/DeleteModal';
import { addOwnedRecord, deleteOwnedRecord, getOwnedRecords, updateOwnedRecord } from '../utils/recordService.ts';
import { validateInvoiceForm } from '../utils/validation';

const emptyForm = { invoiceNumber: '', client: '', project: '', amount: '', paymentMethod: '', dueDate: '', status: 'Pending' };

function Field({ id, label, error, ...props }) {
  return (
    <label className="block text-sm text-slate-300" htmlFor={id}>
      {label}
      <input id={id} {...props} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
      {error && <span id={`${id}-error`} className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

export default function Invoices() {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchInvoices = useCallback(async () => {
    if (!currentUser?.uid) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setInvoices(await getOwnedRecords('invoices', currentUser.uid));
    } catch {
      toast.error('Could not load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const matchesSearch = !search || [invoice.invoiceNumber, invoice.client, invoice.project].some((value) => value?.toLowerCase().includes(search));
      const matchesFilter = selectedFilter === 'All' || invoice.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [invoices, searchQuery, selectedFilter]);

  const openAddForm = () => {
    setEditingInvoice(null);
    setFormData(emptyForm);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEditForm = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceNumber: invoice.invoiceNumber || '',
      client: invoice.client || '',
      project: invoice.project || '',
      amount: String(invoice.amount ?? ''),
      paymentMethod: invoice.paymentMethod || '',
      dueDate: invoice.dueDate || '',
      status: invoice.status || 'Pending',
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingInvoice(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser?.uid || saving) return;

    const errors = validateInvoiceForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    const invoiceData = {
      invoiceNumber: formData.invoiceNumber.trim(),
      client: formData.client.trim(),
      project: formData.project.trim(),
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod.trim(),
      dueDate: formData.dueDate,
      status: formData.status,
    };

    try {
      if (editingInvoice) {
        await updateOwnedRecord('invoices', editingInvoice.id, invoiceData);
        toast.success('Invoice updated.');
      } else {
        await addOwnedRecord('invoices', currentUser.uid, invoiceData);
        toast.success('Invoice added.');
      }
      closeForm();
      await fetchInvoices();
    } catch {
      toast.error('Could not save this invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteOwnedRecord('invoices', deleteTarget.id);
      setInvoices((previous) => previous.filter((invoice) => invoice.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success('Invoice deleted.');
    } catch {
      toast.error('Could not delete this invoice. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const totalRevenue = invoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 animate-fade-in text-white">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Invoices</h1><p className="text-sm text-slate-400 mt-1">Track billing, payment status, and revenue.</p></div>
        <button type="button" onClick={openAddForm} className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition">+ Add Invoice</button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Invoices</p><h2 className="text-2xl font-bold text-white mt-2">{invoices.length}</h2></div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paid</p><h2 className="text-2xl font-bold text-emerald-400 mt-2">{invoices.filter((invoice) => invoice.status === 'Paid').length}</h2></div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending</p><h2 className="text-2xl font-bold text-amber-400 mt-2">{invoices.filter((invoice) => invoice.status === 'Pending').length}</h2></div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Revenue</p><h2 className="text-2xl font-bold text-violet-400 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</h2></div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4"><div className="w-full sm:flex-1"><SearchBar value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search invoices..." /></div><FilterDropdown options={['All', 'Paid', 'Pending', 'Overdue'].map((value) => ({ label: value, value }))} value={selectedFilter} onChange={(event) => setSelectedFilter(event.target.value)} /></div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Loading invoices">{[0, 1, 2, 3].map((item) => <div key={item} className="h-56 rounded-2xl bg-slate-900 animate-pulse" />)}</div>
      ) : filteredInvoices.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{filteredInvoices.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} onEdit={openEditForm} onDelete={setDeleteTarget} />)}</div>
      ) : (
        <EmptyState title={invoices.length ? 'No matching invoices' : 'No Invoices Yet'} message={invoices.length ? 'Try a different search term or payment status filter.' : "You haven't added any invoices yet."} actionLabel="+ Add First Invoice" onAdd={openAddForm} />
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation">
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" aria-labelledby="invoice-form-title">
            <div className="flex items-center justify-between"><h2 id="invoice-form-title" className="text-xl font-semibold">{editingInvoice ? 'Edit Invoice' : 'Add Invoice'}</h2><button type="button" onClick={closeForm} className="text-slate-400 hover:text-white" aria-label="Close">✕</button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field id="invoice-number" label="Invoice number" required maxLength={50} value={formData.invoiceNumber} error={formErrors.invoiceNumber} onChange={(event) => setFormData({ ...formData, invoiceNumber: event.target.value })} /><Field id="invoice-amount" label="Amount (₹)" required type="number" min="0" step="1" value={formData.amount} error={formErrors.amount} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} /></div>
            <Field id="invoice-client" label="Client" required maxLength={120} value={formData.client} error={formErrors.client} onChange={(event) => setFormData({ ...formData, client: event.target.value })} />
            <Field id="invoice-project" label="Project" required maxLength={120} value={formData.project} error={formErrors.project} onChange={(event) => setFormData({ ...formData, project: event.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field id="invoice-payment-method" label="Payment method" required maxLength={80} value={formData.paymentMethod} error={formErrors.paymentMethod} onChange={(event) => setFormData({ ...formData, paymentMethod: event.target.value })} /><Field id="invoice-due-date" label="Due date" required type="date" value={formData.dueDate} error={formErrors.dueDate} onChange={(event) => setFormData({ ...formData, dueDate: event.target.value })} /></div>
            <label className="block text-sm text-slate-300" htmlFor="invoice-status">Status<select id="invoice-status" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"><option>Pending</option><option>Paid</option><option>Overdue</option></select>{formErrors.status && <span className="mt-1 block text-xs text-red-300">{formErrors.status}</span>}</label>
            <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={closeForm} className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">{saving ? 'Saving...' : editingInvoice ? 'Save Changes' : 'Add Invoice'}</button></div>
          </form>
        </div>
      )}

      <DeleteModal isOpen={Boolean(deleteTarget)} title={deleteTarget?.invoiceNumber || 'invoice'} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} isSubmitting={deleting} />
    </div>
  );
}
