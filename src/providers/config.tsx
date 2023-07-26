import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { formattedConfigData } from '@/api/chain/config/query/formattedConfigData.ts';
import { ConfigContext } from '@/contexts/config.ts';
import { useChain } from '@/hooks/useChain.ts';

export interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const { isAuthenticated, actor } = useChain();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const {
    data: configData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['configData'],
    queryFn: () => formattedConfigData(),
  });

  useEffect(() => {
    if (configData != null && isAuthenticated != null) {
      setIsAdmin(configData.admin_acct === actor);
    }
  }, [isAuthenticated, configData, actor]);

  const configProviderValue = useMemo(
    () => ({
      isAdmin,
      configs: configData ?? null,
      reFetch: refetch,
      isLoadingConfig: isLoading,
    }),
    [isAdmin, configData, refetch, isLoading]
  );

  return <ConfigContext.Provider value={configProviderValue}>{children}</ConfigContext.Provider>;
}
