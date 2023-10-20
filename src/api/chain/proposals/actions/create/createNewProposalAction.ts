import { Action, SessionProps } from '@/api/models';
import { CreateProposal } from '@/api/models/actions.ts';
import { NewProposalRequest } from '@/api/models/proposal.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateNewProposalAction extends SessionProps {
  proposal: NewProposalRequest;
}

export default function createNewProposalAction({
  proposal,
  session,
}: CreateNewProposalAction): Action<CreateProposal> {
  const actor = session.actor.toString();

  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.DRAFT_PROPOSAL,
    authorization: [
      {
        actor,
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposer: actor,
      category: proposal.category,
      title: proposal.title,
      description: proposal.description,
      image_url: proposal.image_url,
      estimated_time: proposal.estimated_time,
      mdbody: proposal.content,
      deliverables_count: proposal.deliverables,
      road_map: proposal.road_map,
    },
  };
}
