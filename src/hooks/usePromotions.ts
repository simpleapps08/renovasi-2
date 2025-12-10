import { useState, useEffect } from 'react';
import { getPromotions } from '@/services/api';
import { Promotion } from '@/types/promotion'; // Assuming you have a type definition for Promotion

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getPromotions();
        setPromotions(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return { promotions, isLoading, error };
};
