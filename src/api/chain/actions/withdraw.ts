import createWithdrawAction, { WithdrawAction } from '@/api/chain/actions/create/withDrawAction';

import { execute } from './execute';

export async function withdraw({ quantity, activeUser }: WithdrawAction) {
  return await execute(activeUser, [createWithdrawAction({ quantity, activeUser })]);
}
