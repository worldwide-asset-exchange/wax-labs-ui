import { Session } from '@wharfkit/session';
import { createContext } from 'react';

import { noop } from '@/utils/common.ts';

export interface ChainContextOptions {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  session?: Session;
  isAuthenticated: boolean | null;
}

export const ChainContext = createContext<ChainContextOptions>({
  login: noop,
  logout: noop,
  isAuthenticated: null,
});
