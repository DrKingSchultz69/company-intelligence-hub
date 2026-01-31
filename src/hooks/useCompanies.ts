import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Company } from '@/types/company';

export function useCompanies() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      const { data, error } = await supabase
        .from('company')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Company[];
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('companies-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'company',
        },
        (payload) => {
          console.log('Realtime update:', payload);
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['companies'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useCompany(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['company', id],
    queryFn: async (): Promise<Company | null> => {
      const { data, error } = await supabase
        .from('company')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Company | null;
    },
    enabled: !!id,
  });

  // Subscribe to realtime updates for this specific company
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`company-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'company',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log('Company update:', payload);
          queryClient.invalidateQueries({ queryKey: ['company', id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  return query;
}

export function useCompanyStats() {
  const { data: companies, isLoading } = useCompanies();

  const stats = {
    total: companies?.length || 0,
    byCategory: {} as Record<string, number>,
    byHiringVelocity: {} as Record<string, number>,
    byProfitability: {} as Record<string, number>,
    byRemotePolicy: {} as Record<string, number>,
  };

  if (companies) {
    companies.forEach((company) => {
      // By category
      const cat = company.category || 'Unknown';
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;

      // By hiring velocity
      if (company.hiring_velocity) {
        const velocity = company.hiring_velocity.split(' ')[0] || 'Unknown';
        stats.byHiringVelocity[velocity] = (stats.byHiringVelocity[velocity] || 0) + 1;
      }

      // By profitability
      const profit = company.profitability_status || 'Unknown';
      stats.byProfitability[profit] = (stats.byProfitability[profit] || 0) + 1;

      // By remote policy
      if (company.remote_policy_details) {
        const policy = company.remote_policy_details.includes('Remote') ? 'Remote/Hybrid' : 'On-site';
        stats.byRemotePolicy[policy] = (stats.byRemotePolicy[policy] || 0) + 1;
      }
    });
  }

  return { stats, isLoading };
}
