import { useContext } from 'react';

import { FormattedConfigData } from '@/api/chain/config/query/formattedConfigData.ts';
import { ConfigContext } from '@/contexts/config.ts';

export function useConfigData(): {
  configs: FormattedConfigData | null;
  isAdmin: boolean | null;
  isLoadingConfig: boolean;
  reCache: () => void;
} {
  const { isAdmin, configs, reCache } = useContext(ConfigContext);

  return { isAdmin, configs, isLoadingConfig: configs == null, reCache };
}
