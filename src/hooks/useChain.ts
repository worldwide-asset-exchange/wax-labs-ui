import { useContext } from 'react';

import { ChainContext, ChainContextOptions } from '@/contexts/chain.ts';

export interface ChainOptions extends ChainContextOptions {
  isAuthenticated: boolean;
  actor?: string;
  permission?: string;
}

export function useChain(): ChainOptions {
  const { login, logout, session } = useContext(ChainContext);

  return {
    login,
    logout,
    session,
    isAuthenticated: Boolean(session),
    actor: session?.actor?.toString(),
    permission: session?.permission?.toString(),
  };
}
