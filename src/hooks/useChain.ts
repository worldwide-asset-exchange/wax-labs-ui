import { Session } from '@wharfkit/session';
import { useContext } from 'react';

import { ChainContext, ChainContextOptions } from '@/contexts/chain.ts';

export interface ChainOptions extends ChainContextOptions {
  isAuthenticated: boolean | null;
  actor?: string;
  permission?: string;
}

export function useChain(): ChainOptions {
  const { login, logout, session } = useContext(ChainContext);

  console.debug('session:');
  console.debug(session != null);
  // console.debug("actor:");
  // console.debug(session?.actor);

  return {
    login,
    logout,
    session,
    // isAuthenticated: Boolean(session),
    // isAuthenticated: typeof session != null ? Boolean(session) : null,
    // isAuthenticated: Boolean(session?.actor) ?? null,
    // isAuthenticated: session != null ? Boolean(session) : null,
    // isAuthenticated: session != null ? true : null,
    isAuthenticated: session === 'notLogged' ? false : session == null ? null : true,
    actor: (session as Session)?.actor?.toString(),
    permission: (session as Session)?.permission?.toString(),
  };
}
