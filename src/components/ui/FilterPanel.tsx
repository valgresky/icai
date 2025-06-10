import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
}

interface FilterPanelProps {
  filters: FilterGroup[];
  onFilterChange: (filters: Record<string, string[]>) => void;
}

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setExpandedGroups({
      ...expandedGroups,
      [groupId]: !expandedGroups[groupId]
    });
  };

  const toggleFilter = (groupId: string, optionId: string) => {
    const currentGroupFilters = activeFilters[groupId] || [];
    let newGroupFilters: string[];
    
    if (currentGroupFilters.includes(optionId)) {
      newGroupFilters = currentGroupFilters.filter(id => id !== optionId);
    } else {
      newGroupFilters = [...currentGroupFilters, optionId];
    }
    
    const newFilters = {
      ...activeFilters,
      [groupId]: newGroupFilters
    };
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, filters) => count + filters.length, 0);
  };

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <button 
            onClick={clearFilters}
            className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filters.map((group) => (
          <div key={group.id} className="border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between mb-3"
            >
              <span className="font-medium">{group.name}</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${expandedGroups[group.id] ? 'rotate-180' : ''}`} 
              />
            </button>
            
            <motion.div
              initial={false}
              animate={{ height: expandedGroups[group.id] ? 'auto' : 0, opacity: expandedGroups[group.id] ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 py-1">
                {group.options.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-primary-500 border-neutral-600 bg-neutral-900 focus:ring-primary-500 focus:ring-offset-neutral-900"
                      checked={(activeFilters[group.id] || []).includes(option.id)}
                      onChange={() => toggleFilter(group.id, option.id)}
                    />
                    <span className="text-neutral-300 group-hover:text-white transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;