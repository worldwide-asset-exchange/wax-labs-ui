import { useQuery } from '@tanstack/react-query';

import { configData } from '@/api/chain/proposals';

export function useConfig() {
  const { data: config, isLoading: isLoadingConfig } = useQuery({
    queryKey: ['config'],
    queryFn: () => configData().then(response => response),
  });

  return {
    config,
    isLoadingConfig,
  };
}
