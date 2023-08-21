import { execute } from '@/api/chain/actions';
import { accountHasBalance } from '@/api/chain/profile/query/actorHasBalance.ts';
import createNewProposalAction, {
  CreateNewProposalAction,
} from '@/api/chain/proposals/actions/create/createNewProposalAction';
import createTransferFundsAction from '@/api/chain/transfers/actions/create/createTransferFundsAction';
import { Action } from '@/api/models';
import { CreateProposal as CreateProposalResponse, TransferFunds } from '@/api/models/actions';

export async function createProposal({ session, proposal }: CreateNewProposalAction) {
  const actions: Action<CreateProposalResponse | TransferFunds>[] = [
    createNewProposalAction({
      session,
      proposal,
    }),
  ];

  const hasBalance = await accountHasBalance({ actor: session.actor.toString() });

  if (!hasBalance) {
    actions.unshift(createTransferFundsAction({ session }));
  }

  return await execute(session, actions);
}
