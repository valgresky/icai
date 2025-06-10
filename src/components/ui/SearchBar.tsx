import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ placeholder = 'Search workflows...', className = '' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
      if (inputRef.current) inputRef.current.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Suggestions (could be fetched from API in a real app)
  const suggestions = [
    'Marketing automation',
    'Email workflows',
    'Data extraction',
    'Social media posting',
    'Lead generation'
  ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="glass-card w-full pl-10 pr-10 py-2 text-neutral-200 placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isFocused && query && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full glass-panel divide-y divide-neutral-800"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-neutral-800/50 transition-colors"
                onClick={() => {
                  setQuery(suggestion);
                  navigate(`/marketplace?search=${encodeURIComponent(suggestion)}`);
                  setIsFocused(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;