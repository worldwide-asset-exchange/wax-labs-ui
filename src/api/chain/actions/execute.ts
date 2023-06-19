import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';

/**
 * Execute Chain actions. Requires a signed-in user
 *
 * @throws {Error}
 */
export async function execute(activeUser: WaxUser, actions: Action<unknown>[]) {
  try {
    return await activeUser.signTransaction(
      { actions },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );
  } catch (e) {
    const actionNames = actions.map(a => `\`${a.name}\``).join(', ');
    console.error(`[${actionNames}] Executing actions`, e);

    throw e;
  }
}
