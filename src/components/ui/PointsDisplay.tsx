import { motion } from 'framer-motion';
import { Coins, Gift, Clock, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { usePoints } from '../../hooks/usePoints';
import { formatNumber } from '../../utils/helpers';

interface PointsDisplayProps {
  className?: string;
  showDetails?: boolean;
}

const PointsDisplay = ({ className = '', showDetails = false }: PointsDisplayProps) => {
  const { points, loading, error } = usePoints();

  if (loading) {
    return (
      <div className={`glass-panel p-4 animate-pulse ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-neutral-800"></div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-800 rounded w-24"></div>
            <div className="h-3 bg-neutral-800 rounded w-16"></div>
          </div>
        </div>
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-neutral-800">
            <div className="h-3 bg-neutral-800 rounded w-full mb-2"></div>
            <div className="h-3 bg-neutral-800 rounded w-3/4"></div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-panel p-4 ${className}`}>
        <div className="flex items-center gap-2 text-error-DEFAULT">
          <Info className="w-5 h-5" />
          <p className="text-sm">Unable to load points</p>
        </div>
      </div>
    );
  }

  if (!points) {
    return (
      <div className={`glass-panel p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800/50 flex items-center justify-center">
            <Coins className="w-5 h-5 text-neutral-600" />
          </div>
          <div>
            <p className="font-medium">No Points Yet</p>
            <p className="text-sm text-neutral-400">Make a purchase to earn points</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate dollar value (100 points = $1)
  const dollarValue = (points.available_points / 100).toFixed(2);

  return (
    <div className={`glass-panel p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Coins className="w-5 h-5 text-primary-500" />
        </motion.div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">{formatNumber(points.available_points)}</p>
            <p className="text-sm text-neutral-400">points</p>
          </div>
          <p className="text-sm text-neutral-400">${dollarValue} value</p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-400">Lifetime</p>
              <p className="font-medium">{formatNumber(points.lifetime_points)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-400">Redeemable</p>
              <p className="font-medium">${dollarValue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;