import SessionKit, { Session } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet';
import WebRenderer from '@wharfkit/web-renderer';
import { ReactNode, useEffect, useState } from 'react';

import { APP_NAME, WAX_CHAIN_ID, WAX_RPC } from '@/constants.ts';
import { ChainContext } from '@/contexts/chain.ts';

const sessionKit = new SessionKit({
  appName: APP_NAME,
  chains: [
    {
      id: WAX_CHAIN_ID,
      url: WAX_RPC,
    },
  ],
  ui: new WebRenderer(),
  walletPlugins: [new WalletPluginAnchor(), new WalletPluginCloudWallet()],
});

export interface ChainProviderProps {
  children: ReactNode;
}

export function ChainProvider({ children }: ChainProviderProps) {
  const [session, setSession] = useState<Session | 'notLogged' | null>(null);

  useEffect(() => {
    sessionKit.restore().then(restored => setSession((restored as Session) ?? 'notLogged'));
  }, []);

  async function login() {
    const response = await sessionKit.login();
    setSession(response.session);
  }

  async function logout() {
    await sessionKit.logout(session as Session);
    setSession('notLogged');
  }

  return (
    <ChainContext.Provider
      value={{
        login,
        logout,
        session,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
}
