import { useContext } from 'react';

import { ConfigContext } from '@/contexts/config.ts';

export function useIsAdmin(): boolean | null {
  const { isAdmin } = useContext(ConfigContext);

  return isAdmin;
}
