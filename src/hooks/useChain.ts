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
    actor: session?.actor?.toString(),
    permission: session?.permission?.toString(),
  };
}
