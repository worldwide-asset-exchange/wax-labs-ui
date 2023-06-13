import createNewProposalAction, { NewProposalAction } from '@/api/chain/actions/create/newProposalAction.ts';
import createTransferFundsAction from '@/api/chain/actions/create/transferFundsAction.ts';
import { Action } from '@/api/models';
import { CreateProposal as CreateProposalResponse, TransferFunds } from '@/api/models/actions.ts';

import { execute } from './execute';

export interface CreateProposal extends NewProposalAction {
  transferFunds?: boolean;
}

export async function createProposal({ activeUser, proposal, transferFunds }: CreateProposal) {
  const actions: Action<CreateProposalResponse | TransferFunds>[] = [
    createNewProposalAction({
      activeUser,
      proposal,
    }),
  ];

  if (transferFunds) {
    actions.unshift(createTransferFundsAction({ activeUser }));
  }

  return await execute(activeUser, actions);
}
