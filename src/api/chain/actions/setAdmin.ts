import createSetAdminAction, { SetAdminAction } from '@/api/chain/actions/create/setAdminAction.ts';

import { execute } from './execute';

export async function setAdmin({ newAdmin, activeUser }: SetAdminAction) {
  return await execute(activeUser, [createSetAdminAction({ newAdmin, activeUser })]);
}
