import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

interface PointsData {
  id: string;
  user_id: string;
  total_points: number;
  available_points: number;
  lifetime_points: number;
  updated_at: string;
}

export const usePoints = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [points, setPoints] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPoints = async () => {
      try {
        setLoading(true);
        
        // Get auth token
        const token = await getToken();
        
        if (!token) {
          throw new Error('Unable to authenticate');
        }
        
        // For demo purposes, create mock points data
        // In a real app, this would fetch from the database
        const mockPoints = {
          id: 'mock-id',
          user_id: user.id,
          total_points: 5000,
          available_points: 5000,
          lifetime_points: 5000,
          updated_at: new Date().toISOString()
        };
        
        setPoints(mockPoints);
      } catch (err) {
        console.error('Error fetching points:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [user, getToken]);

  // Function to redeem points
  const redeemPoints = async (pointsToRedeem: number): Promise<boolean> => {
    if (!user || !points) return false;
    
    try {
      if (points.available_points < pointsToRedeem) {
        throw new Error('Insufficient points');
      }
      
      // In a real app, this would call an API to deduct points
      // For demo, we'll just update the local state
      setPoints({
        ...points,
        available_points: points.available_points - pointsToRedeem,
        updated_at: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error('Error redeeming points:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    points,
    loading,
    error,
    redeemPoints
  };
};