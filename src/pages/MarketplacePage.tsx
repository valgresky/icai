import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid, List, Filter as FilterIcon, X } from 'lucide-react';
import WorkflowCard from '../components/ui/WorkflowCard';
import FilterPanel from '../components/ui/FilterPanel';
import SearchBar from '../components/ui/SearchBar';
import { workflows, filterOptions } from '../data/mockData';

const MarketplacePage = () => {
  const [filteredWorkflows, setFilteredWorkflows] = useState(workflows);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    let newFilters = { ...activeFilters };
    
    if (categoryParam) {
      newFilters.category = [categoryParam];
    }
    
    setActiveFilters(newFilters);
    
    // Apply filters and search
    let filtered = [...workflows];
    
    if (searchParam) {
      const searchLower = searchParam.toLowerCase();
      filtered = filtered.filter(workflow => 
        workflow.title.toLowerCase().includes(searchLower) || 
        workflow.description.toLowerCase().includes(searchLower) ||
        workflow.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply active filters
    filtered = applyFilters(filtered, newFilters);
    
    setFilteredWorkflows(filtered);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const applyFilters = (items: typeof workflows, filters: Record<string, string[]>) => {
    return items.filter(workflow => {
      for (const [key, values] of Object.entries(filters)) {
        if (values.length === 0) continue;
        
        switch (key) {
          case 'price':
            const isPriced = workflow.price !== null;
            if (values.includes('free') && isPriced) return false;
            if (values.includes('paid') && !isPriced) return false;
            if (values.includes('under25') && (workflow.price === null || workflow.price >= 25)) return false;
            if (values.includes('25to50') && (workflow.price === null || workflow.price < 25 || workflow.price > 50)) return false;
            if (values.includes('over50') && (workflow.price === null || workflow.price <= 50)) return false;
            break;
            
          case 'category':
            if (!values.includes(workflow.category.toLowerCase())) return false;
            break;
            
          case 'rating':
            if (values.includes('4plus') && workflow.rating < 4) return false;
            if (values.includes('3plus') && workflow.rating < 3) return false;
            if (values.includes('2plus') && workflow.rating < 2) return false;
            break;
        }
      }
      return true;
    });
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    setFilteredWorkflows(applyFilters(workflows, filters));
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredWorkflows(applyFilters(workflows, activeFilters));
      return;
    }
    
    const searchLower = query.toLowerCase();
    const filtered = workflows.filter(workflow => 
      workflow.title.toLowerCase().includes(searchLower) || 
      workflow.description.toLowerCase().includes(searchLower) ||
      workflow.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
    
    setFilteredWorkflows(applyFilters(filtered, activeFilters));
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-4">Workflow Marketplace</h1>
          <p className="text-neutral-400 max-w-2xl">
            Browse our collection of premium and free n8n workflows to supercharge your automation.
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <SearchBar
              className="flex-grow"
              placeholder="Search workflows by title, description, or tags..."
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-ghost flex items-center gap-2 md:hidden"
              >
                {showFilters ? <X className="w-4 h-4" /> : <FilterIcon className="w-4 h-4" />}
                {showFilters ? 'Hide Filters' : 'Filters'}
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-neutral-800'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-neutral-800'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-neutral-400">
            <span>Showing {filteredWorkflows.length} of {workflows.length} workflows</span>
            
            {Object.entries(activeFilters).map(([key, values]) => 
              values.map(value => (
                <div key={`${key}-${value}`} className="flex items-center gap-1 bg-neutral-800 rounded-full px-3 py-1">
                  <span>{value}</span>
                  <button
                    onClick={() => {
                      const newFilters = { ...activeFilters };
                      newFilters[key] = newFilters[key].filter(v => v !== value);
                      handleFilterChange(newFilters);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
            
            {Object.values(activeFilters).some(values => values.length > 0) && (
              <button
                onClick={() => handleFilterChange({})}
                className="text-primary-400 hover:text-primary-300"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <motion.div
            className={`w-full md:w-64 md:block ${showFilters ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterPanel
              filters={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </motion.div>
          
          {/* Workflow Grid/List */}
          <div className="flex-grow">
            {filteredWorkflows.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No workflows found</h3>
                <p className="text-neutral-400 mb-6">
                  We couldn't find any workflows matching your search criteria.
                </p>
                <button
                  onClick={() => {
                    handleFilterChange({});
                    handleSearch('');
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkflows.map((workflow) => (
                      <WorkflowCard key={workflow.id} {...workflow} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredWorkflows.map((workflow) => (
                      <div key={workflow.id} className="glass-card p-4 flex gap-4">
                        <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                          <img src={workflow.image} alt={workflow.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow flex flex-col">
                          <h3 className="font-semibold text-lg mb-1">{workflow.title}</h3>
                          <p className="text-neutral-400 text-sm mb-2 line-clamp-2">{workflow.description}</p>
                          <div className="mt-auto flex justify-between items-center">
                            <span className={workflow.price === null ? "text-accent-500" : "text-white"}>
                              {workflow.price === null ? "Free" : `$${workflow.price}`}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-neutral-400">{workflow.downloads} downloads</span>
                              <button className="btn-primary">View</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;