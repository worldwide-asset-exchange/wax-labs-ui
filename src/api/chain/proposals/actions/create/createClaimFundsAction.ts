import { Action, SessionProps } from '@/api/models';
import { ClaimFunds } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateClaimFundsAction extends SessionProps {
  proposalId: number;
  deliverableId: number;
}

export default function createClaimFundsAction({
  session,
  proposalId,
  deliverableId,
}: CreateClaimFundsAction): Action<ClaimFunds> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.CLAIM_FUNDS,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposal_id: proposalId,
      deliverable_id: deliverableId,
    },
  };
}
