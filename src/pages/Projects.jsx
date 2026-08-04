import React, { useState } from 'react';
import { projectsData } from '../data/projects';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropDown';
import ProjectCard from '../components/ProjectCard';
import ActionButton from '../components/ActionButton';
import EmptyState from '../components/EmptyState';

export default function Projects() {
  const [projectsList, setProjectsList] = useState(projectsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' }
  ];

  const filteredProjects = projectsList.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || project.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Manage all your ongoing projects.</p>
        </div>
        <ActionButton text="+ New Project" variant="primary" />
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:flex-1">
          <SearchBar 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <FilterDropdown 
          options={filterOptions}
          value={selectedFilter} 
          onChange={(e) => setSelectedFilter(e.target.value)} 
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

    </div>
  );
}