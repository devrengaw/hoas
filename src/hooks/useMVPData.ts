import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useMVPData<T>(tableName: string, query?: any) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let request = supabase.from(tableName).select('*');
        
        if (query) {
          // Apply simple filters for MVP
          Object.keys(query).forEach(key => {
            request = request.eq(key, query[key]);
          });
        }

        const { data: result, error: fetchError } = await request;

        if (fetchError) throw fetchError;
        setData(result || []);
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tableName, JSON.stringify(query)]);

  return { data, loading, error, refresh: () => setLoading(true) };
}
