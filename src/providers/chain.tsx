import SessionKit, { Session } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet';
import WebRenderer from '@wharfkit/web-renderer';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { APP_NAME, WAX_CHAIN_ID, WAX_RPC } from '@/constants.ts';
import { ChainContext } from '@/contexts/chain.ts';

const SLUGIFIED_APP_NAME = APP_NAME.replace(' ', '_').toLowerCase();

const sessionKit = new SessionKit({
  appName: SLUGIFIED_APP_NAME,
  chains: [
    {
      id: WAX_CHAIN_ID,
      url: WAX_RPC,
    },
  ],
  ui: new WebRenderer(),
  walletPlugins: [new WalletPluginAnchor(), new WalletPluginCloudWallet()],
});

const LOCALSTORAGE_SESSION_KEY = `wharf-${sessionKit.appName}-session`;

export interface ChainProviderProps {
  children: ReactNode;
}

export function ChainProvider({ children }: ChainProviderProps) {
  const [session, setSession] = useState<Session>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const logout = useCallback(async () => {
    await sessionKit.logout(session);
    setSession(undefined);
    setIsAuthenticated(false);
  }, [session]);

  const login = useCallback(async () => {
    const response = await sessionKit.login();
    setSession(response.session);
    setIsAuthenticated(true);
  }, []);

  const chainContextValue = useMemo(
    () => ({
      login,
      logout,
      session,
      isAuthenticated,
    }),
    [logout, login, session, isAuthenticated]
  );

  const restoreSession = async () => {
    try {
      const restoredSession = await sessionKit.restore();
      setSession(restoredSession);
      setIsAuthenticated(restoredSession != null);
    } catch {
      setSession(undefined);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    void restoreSession();
  }, []);

  useEffect(() => {
    // handle what happens on key press
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCALSTORAGE_SESSION_KEY && event.newValue == null) {
        setSession(undefined);
        setIsAuthenticated(false);
      } else if (event.key === LOCALSTORAGE_SESSION_KEY && event.newValue != null) {
        void restoreSession();
      }
    };

    // attach the event listener
    window.addEventListener('storage', handleStorageChange);

    // remove the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]);

  return <ChainContext.Provider value={chainContextValue}>{children}</ChainContext.Provider>;
}
