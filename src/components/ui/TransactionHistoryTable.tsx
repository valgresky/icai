import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, DollarSign, Calendar } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface TransactionHistoryTableProps {
  limit?: number;
  className?: string;
}

const TransactionHistoryTable = ({ limit = 10, className = '' }: TransactionHistoryTableProps) => {
  const { transactions, loading, error } = useTransactions(limit);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 5;
  
  // Paginate
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

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
        <p className="text-error-DEFAULT">Error loading transaction history</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={`glass-panel p-4 ${className}`}>
        <h3 className="font-medium mb-4">Transaction History</h3>
        <div className="text-center py-6">
          <Clock className="w-12 h-12 text-neutral-700 mx-auto mb-2" />
          <p className="text-neutral-400">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-4 ${className}`}>
      <h3 className="font-medium mb-4">Transaction History</h3>
      
      <div className="space-y-3 mb-4">
        {paginatedTransactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{transaction.description || 'Purchase'}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(transaction.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">{formatCurrency(transaction.amount / 100)}</div>
              <div className="text-xs">
                <span className={`inline-block px-2 py-0.5 rounded-full ${
                  transaction.status === 'completed' 
                    ? 'bg-success-DEFAULT/20 text-success-DEFAULT' 
                    : 'bg-warning-DEFAULT/20 text-warning-DEFAULT'
                }`}>
                  {transaction.status}
                </span>
              </div>
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

export default TransactionHistoryTable;