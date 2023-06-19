import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { EditProposal } from '@/api/models/actions.ts';
import { EditProposalRequest } from '@/api/models/proposal.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateEditProposalAction {
  proposal: EditProposalRequest;
  activeUser: WaxUser;
}

export default function createEditProposalAction({
  proposal,
  activeUser: { accountName, requestPermission },
}: CreateEditProposalAction): Action<EditProposal> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.EDIT_PROPOSAL,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
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
