import { execute } from '@/api/chain/actions';
import createSetAdminAction, { CreateSetAdminAction } from '@/api/chain/admin/actions/create/createSetAdminAction.ts';

export async function setAdmin({ newAdmin, activeUser }: CreateSetAdminAction) {
  return await execute(activeUser, [createSetAdminAction({ newAdmin, activeUser })]);
}
