import { Action, SessionProps } from '@/api/models';
import { EditProposal } from '@/api/models/actions.ts';
import { EditProposalRequest } from '@/api/models/proposal.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateEditProposalAction extends SessionProps {
  proposal: EditProposalRequest;
}

export default function createEditProposalAction({
  proposal,
  session,
}: CreateEditProposalAction): Action<EditProposal> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.EDIT_PROPOSAL,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposal_id: proposal.proposal_id,
      category: proposal.category,
      title: proposal.title,
      description: proposal.description,
      image_url: proposal.image_url,
      estimated_time: proposal.estimated_time,
      mdbody: proposal.content,
      road_map: proposal.road_map,
    },
  };
}
