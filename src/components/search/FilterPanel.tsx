import React from 'react';
import { FiFilter } from 'react-icons/fi';

export interface SearchFilters {
  location?: string;
  skills?: string[];
  type?: string;
  category?: string;
  minSalary?: number;
  maxSalary?: number;
}

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  categories?: string[];
  jobTypes?: string[];
  showJobFilters?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  categories = ['Acting', 'Music', 'Dance', 'Visual Arts', 'Photography', 'Other'],
  jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary'],
  showJobFilters = false,
}) => {
  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(',').map(s => s.trim()).filter(Boolean);
    onFilterChange({ ...filters, skills });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <FiFilter className="mr-2" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>

      <div className="space-y-4">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            placeholder="Enter location..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        {/* Skills Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={filters.skills?.join(', ') || ''}
            onChange={(e) => handleSkillsChange(e.target.value)}
            placeholder="e.g., Acting, Dancing, Singing"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        {showJobFilters && (
          <>
            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="">All Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.minSalary || ''}
                  onChange={(e) => onFilterChange({ ...filters, minSalary: Number(e.target.value) })}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <input
                  type="number"
                  value={filters.maxSalary || ''}
                  onChange={(e) => onFilterChange({ ...filters, maxSalary: Number(e.target.value) })}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
