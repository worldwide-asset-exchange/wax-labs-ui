import { execute } from '@/api/chain/actions';
import createSetAdminAction, { CreateSetAdminAction } from '@/api/chain/admin/actions/create/createSetAdminAction.ts';

export async function setAdmin({ newAdmin, session }: CreateSetAdminAction) {
  return await execute(session, [createSetAdminAction({ newAdmin, session })]);
}
