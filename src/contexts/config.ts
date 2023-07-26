import { createContext } from 'react';

import { FormattedConfigData } from '@/api/chain/config/query/formattedConfigData.ts';
import { noop } from '@/utils/common.ts';

export interface ConfigContextOptions {
  configs: FormattedConfigData | null;
  isAdmin: boolean | null;
  isLoadingConfig: boolean | null;
  reFetch: () => void;
}

export const ConfigContext = createContext<ConfigContextOptions>({
  configs: null,
  isAdmin: null,
  isLoadingConfig: null,
  reFetch: noop,
});
