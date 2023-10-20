import { execute } from '@/api/chain/actions';
import { accountHasBalance } from '@/api/chain/profile/query/actorHasBalance.ts';
import createBeginVotingAction, {
  CreateBeginVotingAction,
} from '@/api/chain/proposals/actions/create/createBeginVotingAction.ts';
import createTransferFundsAction from '@/api/chain/transfers/actions/create/createTransferFundsAction.ts';
import { Action } from '@/api/models';
import { BeginVoting, TransferFunds } from '@/api/models/actions.ts';
import { BEGIN_VOTING_AMOUNT } from '@/constants.ts';

export async function beginVoting({ ballotName, proposalId, session }: CreateBeginVotingAction) {
  const actions: Action<BeginVoting | TransferFunds>[] = [createBeginVotingAction({ ballotName, proposalId, session })];

  const hasBalance = await accountHasBalance({
    actor: session.actor.toString(),
    minRequiredBalance: BEGIN_VOTING_AMOUNT,
  });

  if (!hasBalance) {
    actions.unshift(createTransferFundsAction({ session }));
  }

  return await execute(session, actions);
}
