import { useContext } from 'react';

import { FormattedConfigData } from '@/api/chain/config/query/formattedConfigData.ts';
import { ConfigContext } from '@/contexts/config.ts';

export function useConfigData(): {
  configs: FormattedConfigData | null;
  isAdmin: boolean | null;
  isLoadingConfig: boolean | null;
  reFetch: () => void;
} {
  const { isAdmin, configs, isLoadingConfig, reFetch } = useContext(ConfigContext);

  return { isAdmin, configs, isLoadingConfig, reFetch };
}
