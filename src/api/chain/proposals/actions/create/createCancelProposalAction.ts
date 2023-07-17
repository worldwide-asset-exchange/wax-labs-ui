import { Action, SessionProps } from '@/api/models';
import { GenericProposalWithMemo } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateCancelProposalAction extends SessionProps {
  proposalId: number;
  memo: string;
}

export default function createCancelProposalAction({
  session,
  proposalId,
  memo,
}: CreateCancelProposalAction): Action<GenericProposalWithMemo> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.CANCEL_PROPOSAL,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposal_id: proposalId,
      memo,
    },
  };
}
