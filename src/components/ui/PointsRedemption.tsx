import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { usePoints } from '../../hooks/usePoints';
import { formatNumber } from '../../utils/helpers';

interface PointsRedemptionProps {
  onPointsChange: (points: number) => void;
  className?: string;
}

const PointsRedemption = ({ onPointsChange, className = '' }: PointsRedemptionProps) => {
  const { points, loading, error } = usePoints();
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate dollar value (100 points = $1)
  const dollarValue = (pointsToRedeem / 100).toFixed(2);
  const maxPoints = points?.available_points || 0;
  const maxDollarValue = (maxPoints / 100).toFixed(2);

  const handlePointsChange = (value: number) => {
    // Ensure value is within bounds
    const newValue = Math.max(0, Math.min(value, maxPoints));
    
    // Round to nearest 100
    const roundedValue = Math.floor(newValue / 100) * 100;
    
    setPointsToRedeem(roundedValue);
    onPointsChange(roundedValue);
  };

  const handleApplyPoints = () => {
    if (pointsToRedeem > 0) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className={`glass-panel p-4 animate-pulse ${className}`}>
        <div className="h-5 bg-neutral-800 rounded w-40 mb-4"></div>
        <div className="h-10 bg-neutral-800 rounded w-full mb-4"></div>
        <div className="h-4 bg-neutral-800 rounded w-24 mb-2"></div>
        <div className="h-10 bg-neutral-800 rounded w-full"></div>
      </div>
    );
  }

  if (error || !points || points.available_points === 0) {
    return null; // Don't show if there's an error or no points
  }

  return (
    <div className={`glass-panel p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Coins className="w-4 h-4 text-primary-500" />
          Use Your Points
        </h3>
        <span className="text-sm text-neutral-400">
          {formatNumber(points.available_points)} available
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-neutral-400 mb-2">
          Points to redeem (in increments of 100)
        </label>
        <input
          type="range"
          min="0"
          max={maxPoints}
          step="100"
          value={pointsToRedeem}
          onChange={(e) => handlePointsChange(parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          <span>0</span>
          <span>{formatNumber(maxPoints)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-400">Points selected:</div>
        <div className="font-medium">{formatNumber(pointsToRedeem)}</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-400">Discount value:</div>
        <div className="font-bold text-primary-500">${dollarValue}</div>
      </div>

      {pointsToRedeem > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg mb-4"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary-500" />
            <p className="text-sm text-primary-400">
              {formatNumber(pointsToRedeem)} points will be applied as ${dollarValue} discount
            </p>
          </div>
        </motion.div>
      )}

      <button
        onClick={handleApplyPoints}
        disabled={pointsToRedeem === 0 || showSuccess}
        className="btn-primary w-full py-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {showSuccess ? (
          <>
            <Check className="w-4 h-4" />
            Points Applied
          </>
        ) : (
          <>
            <ArrowRight className="w-4 h-4" />
            Apply Points
          </>
        )}
      </button>
    </div>
  );
};

export default PointsRedemption;