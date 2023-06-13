import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { CreateProposal } from '@/api/models/actions';
import { NewProposalRequest } from '@/api/models/proposal.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface NewProposalAction {
  proposal: NewProposalRequest;
  activeUser: WaxUser;
}

export default function createNewProposalAction({
  proposal,
  activeUser: { accountName, requestPermission },
}: NewProposalAction): Action<CreateProposal> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.DRAFT_PROPOSAL,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      proposer: accountName,
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
