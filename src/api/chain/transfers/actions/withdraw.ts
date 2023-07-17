import { execute } from '@/api/chain/actions';
import createWithdrawAction, {
  CreateWithdrawAction,
} from '@/api/chain/transfers/actions/create/createWithdrawAction.ts';

export async function withdraw({ quantity, session }: CreateWithdrawAction) {
  return await execute(session, [createWithdrawAction({ quantity, session })]);
}
