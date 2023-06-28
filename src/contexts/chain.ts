import { Session } from '@wharfkit/session';
import { createContext } from 'react';

export interface ChainContextOptions {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  session?: Session;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
async function noop() {}

export const ChainContext = createContext<ChainContextOptions>({
  login: noop,
  logout: noop,
});
