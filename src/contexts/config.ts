import { createContext } from 'react';

import { FormattedConfigData } from '@/api/chain/config/query/formattedConfigData.ts';

export interface ConfigContextOptions {
  configs: FormattedConfigData | null;
  isAdmin: boolean | null;
  isLoadingConfig: boolean | null;
  reFetch: () => Promise<void>;
}

export const ConfigContext = createContext<ConfigContextOptions>({
  configs: null,
  isAdmin: null,
  isLoadingConfig: null,
  reFetch: () => Promise.resolve(),
});
