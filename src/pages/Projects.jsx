import React, { useCallback, useMemo, useState } from 'react';
import { projectsData } from '../data/projects';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropDown';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';

const filterOptions = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleFilterChange = useCallback((event) => {
    setSelectedFilter(event.target.value);
  }, []);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase();

    return projectsData.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(normalizedSearch) ||
                            project.client.toLowerCase().includes(normalizedSearch);
      const matchesFilter = selectedFilter === 'All' || project.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Sample projects for the dashboard preview.</p>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:flex-1">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <FilterDropdown 
          options={filterOptions}
          value={selectedFilter}
          onChange={handleFilterChange}
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching projects"
          message="Try a different search term or status filter."
        />
      )}

    </div>
  );
}
