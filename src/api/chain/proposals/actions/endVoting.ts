import { execute } from '@/api/chain/actions';
import createEndVotingAction, {
  CreateEndVotingAction,
} from '@/api/chain/proposals/actions/create/createEndVotingAction.ts';

export async function endVoting({ ballotName, proposalId, session }: CreateEndVotingAction) {
  return await execute(session, [createEndVotingAction({ ballotName, proposalId, session })]);
}
