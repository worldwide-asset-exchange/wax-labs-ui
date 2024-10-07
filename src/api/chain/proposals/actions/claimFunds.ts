import { execute } from '@/api/chain/actions';
import createClaimFundsAction from '@/api/chain/proposals/actions/create/createClaimFundsAction.ts';
import { Action, SessionProps } from '@/api/models';
import { ClaimFunds, Withdraw } from '@/api/models/actions.ts';
import { Deliverables } from '@/api/models/deliverables.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateClaimFundsProps extends SessionProps {
  proposalId: number;
  deliverable: Deliverables;
}

export async function claimFunds({ deliverable, proposalId, session }: CreateClaimFundsProps) {
  const actions: Action<Withdraw | ClaimFunds>[] = [
    createClaimFundsAction({ deliverableId: deliverable.deliverable_id!, proposalId, session }),
  ];

  const actor = session.actor.toString();

  if (deliverable.recipient === actor) {
    actions.push({
      account: LABS_CONTRACT_ACCOUNT,
      name: Actions.WITHDRAW,
      authorization: [
        {
          actor: actor,
          permission: session.permission.toString(),
        },
      ],
      data: {
        account_owner: actor,
        quantity: deliverable.claimable_wax!,
      },
    });
  }

  return await execute(session, actions);
}
