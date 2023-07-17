import { execute } from '@/api/chain/actions';
import createSkipVotingAction, {
  CreateSkipVotingAction,
} from '@/api/chain/voting/actions/create/createSkipVotingAction.ts';

export async function skipVoting({ memo, proposalId, session }: CreateSkipVotingAction) {
  return await execute(session, [createSkipVotingAction({ memo, proposalId, session })]);
}
