import { Session } from '@wharfkit/session';
import { useContext } from 'react';

import { ChainContext, ChainContextOptions } from '@/contexts/chain.ts';

export interface ChainOptions extends ChainContextOptions {
  isAuthenticated: boolean | null;
  actor?: string;
  permission?: string;
}

export function useChain(): ChainOptions {
  const { login, logout, isAuthenticated, session } = useContext(ChainContext);

  return {
    login,
    logout,
    session,
    isAuthenticated,
    actor: (session as Session)?.actor?.toString(),
    permission: (session as Session)?.permission?.toString(),
  };
}
