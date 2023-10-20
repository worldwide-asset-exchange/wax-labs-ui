import { execute } from '@/api/chain/actions';
import createEndVotingAction, {
  CreateEndVotingAction,
} from '@/api/chain/proposals/actions/create/createEndVotingAction.ts';

export async function endVoting({ proposalId, session }: CreateEndVotingAction) {
  return await execute(session, [createEndVotingAction({ proposalId, session })]);
}
