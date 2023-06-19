import createWithdrawAction, { CreateWithdrawAction } from '@/api/chain/actions/create/createWithdrawAction.ts';

import { execute } from './execute';

export async function withdraw({ quantity, activeUser }: CreateWithdrawAction) {
  return await execute(activeUser, [createWithdrawAction({ quantity, activeUser })]);
}
