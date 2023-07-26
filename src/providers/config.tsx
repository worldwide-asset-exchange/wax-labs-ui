import { ReactNode, useEffect, useMemo, useState } from 'react';

import { FormattedConfigData, formattedConfigData } from '@/api/chain/config/query/formattedConfigData.ts';
import { ConfigContext } from '@/contexts/config.ts';
import { useChain } from '@/hooks/useChain.ts';

export interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const { isAuthenticated, actor } = useChain();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [configData, setConfigData] = useState<FormattedConfigData | null>(null);

  const retrieveConfigData = () => {
    formattedConfigData()
      .then(c => {
        if (c) {
          c.categories = c?.categories.filter(category => !c?.cat_deprecated.includes(category));
        }

        setConfigData(c);
      })
      .catch(() => setConfigData(null));
  };

  useEffect(() => {
    retrieveConfigData();
  }, []);

  useEffect(() => {
    if (configData != null && isAuthenticated != null) {
      setIsAdmin(configData.admin_acct === actor);
    }
  }, [isAuthenticated, configData, actor]);

  const configProviderValue = useMemo(
    () => ({
      isAdmin,
      configs: configData,
      reCache: retrieveConfigData,
    }),
    [configData, isAdmin]
  );

  return <ConfigContext.Provider value={configProviderValue}>{children}</ConfigContext.Provider>;
}
