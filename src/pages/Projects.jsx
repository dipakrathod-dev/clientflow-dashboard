import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropDown';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import DeleteModal from '../components/DeleteModal';
import { addOwnedRecord, deleteOwnedRecord, getOwnedRecords, updateOwnedRecord } from '../utils/recordService';
import { validateProjectForm } from '../utils/validation';

const emptyForm = { name: '', client: '', progress: '0', deadline: '', status: 'Active', budget: '' };

function Field({ id, label, error, ...props }) {
  return (
    <label className="block text-sm text-slate-300" htmlFor={id}>
      {label}
      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
      />
      {error && <span id={`${id}-error`} className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

export default function Projects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchProjects = useCallback(async () => {
    if (!currentUser?.uid) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setProjects(await getOwnedRecords('projects', currentUser.uid));
    } catch {
      toast.error('Could not load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch = !search || [project.name, project.client].some((value) => value?.toLowerCase().includes(search));
      const matchesFilter = selectedFilter === 'All' || project.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, selectedFilter]);

  const openAddForm = () => {
    setEditingProject(null);
    setFormData(emptyForm);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || '',
      client: project.client || '',
      progress: String(project.progress ?? 0),
      deadline: project.deadline || '',
      status: project.status || 'Active',
      budget: String(project.budget ?? ''),
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProject(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser?.uid || saving) return;

    const errors = validateProjectForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    const projectData = {
      name: formData.name.trim(),
      client: formData.client.trim(),
      progress: Number(formData.progress),
      deadline: formData.deadline,
      status: formData.status,
      budget: Number(formData.budget),
    };

    try {
      if (editingProject) {
        await updateOwnedRecord('projects', editingProject.id, projectData);
        toast.success('Project updated.');
      } else {
        await addOwnedRecord('projects', currentUser.uid, projectData);
        toast.success('Project added.');
      }
      closeForm();
      await fetchProjects();
    } catch {
      toast.error('Could not save this project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteOwnedRecord('projects', deleteTarget.id);
      setProjects((previous) => previous.filter((project) => project.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success('Project deleted.');
    } catch {
      toast.error('Could not delete this project. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 animate-fade-in text-white">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Track your projects, progress, deadlines, and budgets.</p>
        </div>
        <button type="button" onClick={openAddForm} className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition">
          + Add Project
        </button>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:flex-1"><SearchBar value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search projects..." /></div>
        <FilterDropdown options={['All', 'Active', 'Pending', 'Completed'].map((value) => ({ label: value, value }))} value={selectedFilter} onChange={(event) => setSelectedFilter(event.target.value)} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Loading projects">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-64 rounded-2xl bg-slate-900 animate-pulse" />)}
        </div>
      ) : filteredProjects.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} onEdit={openEditForm} onDelete={setDeleteTarget} />)}
        </div>
      ) : (
        <EmptyState title={projects.length ? 'No matching projects' : 'No Projects Yet'} message={projects.length ? 'Try a different search term or status filter.' : "You haven't added any projects yet."} actionLabel="+ Add First Project" onAdd={openAddForm} />
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation">
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" aria-labelledby="project-form-title">
            <div className="flex items-center justify-between"><h2 id="project-form-title" className="text-xl font-semibold">{editingProject ? 'Edit Project' : 'Add Project'}</h2><button type="button" onClick={closeForm} className="text-slate-400 hover:text-white" aria-label="Close">✕</button></div>
            <Field id="project-name" label="Project name" required maxLength={120} value={formData.name} error={formErrors.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
            <Field id="project-client" label="Client" required maxLength={120} value={formData.client} error={formErrors.client} onChange={(event) => setFormData({ ...formData, client: event.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="project-progress" label="Progress (%)" required type="number" min="0" max="100" step="1" value={formData.progress} error={formErrors.progress} onChange={(event) => setFormData({ ...formData, progress: event.target.value })} />
              <Field id="project-budget" label="Budget (₹)" required type="number" min="0" step="1" value={formData.budget} error={formErrors.budget} onChange={(event) => setFormData({ ...formData, budget: event.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="project-deadline" label="Deadline" required type="date" value={formData.deadline} error={formErrors.deadline} onChange={(event) => setFormData({ ...formData, deadline: event.target.value })} />
              <label className="block text-sm text-slate-300" htmlFor="project-status">Status<select id="project-status" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"><option>Active</option><option>Pending</option><option>Completed</option></select>{formErrors.status && <span className="mt-1 block text-xs text-red-300">{formErrors.status}</span>}</label>
            </div>
            <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={closeForm} className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">{saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Add Project'}</button></div>
          </form>
        </div>
      )}

      <DeleteModal isOpen={Boolean(deleteTarget)} title={deleteTarget?.name || 'project'} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} isSubmitting={deleting} />
    </div>
  );
}
