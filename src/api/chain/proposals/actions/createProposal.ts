import { execute } from '@/api/chain/actions';
import createNewProposalAction, {
  CreateNewProposalAction,
} from '@/api/chain/proposals/actions/create/createNewProposalAction';
import createTransferFundsAction from '@/api/chain/transfers/actions/create/createTransferFundsAction';
import { Action } from '@/api/models';
import { CreateProposal as CreateProposalResponse, TransferFunds } from '@/api/models/actions';

export interface CreateProposal extends CreateNewProposalAction {
  transferFunds?: boolean;
}

export async function createProposal({ session, proposal, transferFunds = true }: CreateProposal) {
  const actions: Action<CreateProposalResponse | TransferFunds>[] = [
    createNewProposalAction({
      session,
      proposal,
    }),
  ];

  if (transferFunds) {
    actions.unshift(createTransferFundsAction({ session }));
  }

  return await execute(session, actions);
}
