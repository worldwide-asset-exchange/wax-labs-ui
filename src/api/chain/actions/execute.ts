import { AnyAction } from '@greymass/eosio';
import { Session } from '@wharfkit/session';

import { Action } from '@/api/models';

/**
 * Execute Chain actions. Requires a signed-in user
 *
 * @throws {Error}
 */
export async function execute(session: Session, actions: Action<unknown>[]) {
  try {
    return await session.transact(
      {
        actions: actions as AnyAction[],
      },
      {
        expireSeconds: 30,
      }
    );
  } catch (e) {
    const actionNames = actions.map(a => `\`${a.name}\``).join(', ');
    console.error(`[${actionNames}] Executing actions`, e);

    throw e;
  }
}
