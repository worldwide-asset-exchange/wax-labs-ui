import { useQuery } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';

import { formattedConfigData } from '@/api/chain/config/query/formattedConfigData.ts';
import { ConfigContext } from '@/contexts/config.ts';
import { useChain } from '@/hooks/useChain.ts';

export interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const { isAuthenticated, actor } = useChain();

  const {
    data: configData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['configData'],
    queryFn: () => formattedConfigData(),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  let isAdmin: boolean | null = null;
  if (configData != null && isAuthenticated != null) {
    isAdmin = configData.admin_acct === actor;
  }

  const configProviderValue = useMemo(
    () => ({
      isAdmin,
      configs: configData ?? null,
      reFetch: () =>
        new Promise<void>(resolve => {
          setTimeout(() => {
            refetch()
              .then(() => resolve())
              .catch(() => resolve());
          }, 1000);
        }),
      isLoadingConfig: isLoading,
    }),
    [isAdmin, configData, refetch, isLoading]
  );

  return <ConfigContext.Provider value={configProviderValue}>{children}</ConfigContext.Provider>;
}
