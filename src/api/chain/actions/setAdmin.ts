import createSetAdminAction, { CreateSetAdminAction } from '@/api/chain/actions/create/createSetAdminAction.ts';

import { execute } from './execute';

export async function setAdmin({ newAdmin, activeUser }: CreateSetAdminAction) {
  return await execute(activeUser, [createSetAdminAction({ newAdmin, activeUser })]);
}
