import { useState, useEffect } from 'react';
import { getRecentProjects } from '@/services/api';
import { Project } from '@/types/project'; // Assuming you have a type definition for Project
import { useAuth } from '@/contexts/AuthContext';

export const useRecentProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        try {
          const data = await getRecentProjects(user.id);
          setProjects(data);
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProjects();
    }
  }, [user]);

  return { projects, isLoading, error };
};
