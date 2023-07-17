import { execute } from '@/api/chain/actions';
import createBeginVotingAction, {
  CreateBeginVotingAction,
} from '@/api/chain/proposals/actions/create/createBeginVotingAction.ts';

export async function beginVoting({ ballotName, proposalId, session }: CreateBeginVotingAction) {
  return await execute(session, [createBeginVotingAction({ ballotName, proposalId, session })]);
}
