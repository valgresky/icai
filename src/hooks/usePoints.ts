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
        
        // Fetch points data
        const { data, error } = await supabase
          .from('user_points')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        setPoints(data);
      } catch (err) {
        console.error('Error fetching points:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('points_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_points',
        filter: `user_id=eq.${user.id}`
      }, fetchPoints)
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, getToken]);

  // Function to redeem points
  const redeemPoints = async (pointsToRedeem: number): Promise<boolean> => {
    if (!user || !points) return false;
    
    try {
      if (points.available_points < pointsToRedeem) {
        throw new Error('Insufficient points');
      }
      
      const token = await getToken();
      
      if (!token) {
        throw new Error('Unable to authenticate');
      }
      
      const { error } = await supabase.rpc('deduct_points', {
        user_id: user.id,
        points_to_deduct: pointsToRedeem
      });
      
      if (error) throw error;
      
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