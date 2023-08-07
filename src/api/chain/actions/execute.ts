import { Action, AnyAction, Session } from '@wharfkit/session';

/**
 * Execute Chain actions. Requires a signed-in user
 *
 * @throws {Error}
 */
export async function execute(session: Session, actions: AnyAction[]) {
  try {
    return await session.transact(
      {
        actions: actions.map(a => Action.from(a)),
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
