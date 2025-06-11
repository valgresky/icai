import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePointsHistory } from '../../hooks/usePointsHistory';
import { formatNumber, formatDate } from '../../utils/helpers';

interface PointsHistoryTableProps {
  limit?: number;
  className?: string;
}

const PointsHistoryTable = ({ limit = 10, className = '' }: PointsHistoryTableProps) => {
  const { pointsHistory, loading, error } = usePointsHistory(limit);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'earned' | 'redeemed'>('all');
  
  const itemsPerPage = 5;
  
  // Apply filters
  const filteredHistory = pointsHistory.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });
  
  // Paginate
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className={`glass-panel p-4 animate-pulse ${className}`}>
        <div className="h-6 bg-neutral-800 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-neutral-800 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-panel p-4 ${className}`}>
        <p className="text-error-DEFAULT">Error loading points history</p>
      </div>
    );
  }

  if (pointsHistory.length === 0) {
    return (
      <div className={`glass-panel p-4 ${className}`}>
        <h3 className="font-medium mb-4">Points History</h3>
        <div className="text-center py-6">
          <Clock className="w-12 h-12 text-neutral-700 mx-auto mb-2" />
          <p className="text-neutral-400">No points activity yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Points History</h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 text-xs rounded ${
                filter === 'all' ? 'bg-primary-500 text-white' : 'text-neutral-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('earned')}
              className={`px-2 py-1 text-xs rounded ${
                filter === 'earned' ? 'bg-success-DEFAULT text-white' : 'text-neutral-400'
              }`}
            >
              Earned
            </button>
            <button
              onClick={() => setFilter('redeemed')}
              className={`px-2 py-1 text-xs rounded ${
                filter === 'redeemed' ? 'bg-error-DEFAULT text-white' : 'text-neutral-400'
              }`}
            >
              Redeemed
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {paginatedHistory.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.type === 'earned' 
                  ? 'bg-success-DEFAULT/20 text-success-DEFAULT' 
                  : 'bg-error-DEFAULT/20 text-error-DEFAULT'
              }`}>
                {item.type === 'earned' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">{item.description || (item.type === 'earned' ? 'Points earned' : 'Points redeemed')}</p>
                <p className="text-xs text-neutral-500">{formatDate(item.created_at)}</p>
              </div>
            </div>
            <div className={`font-bold ${
              item.type === 'earned' ? 'text-success-DEFAULT' : 'text-error-DEFAULT'
            }`}>
              {item.type === 'earned' ? '+' : '-'}{formatNumber(Math.abs(item.points))}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-neutral-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PointsHistoryTable;