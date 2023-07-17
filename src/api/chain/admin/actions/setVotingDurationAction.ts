import { execute } from '@/api/chain/actions';
import createSetVotingDurationAction, {
  CreateSetVotingDurationAction,
} from '@/api/chain/admin/actions/create/createSetVotingDurationAction.ts';

export async function setVotingDurationAction({ newVoteDuration, session }: CreateSetVotingDurationAction) {
  return await execute(session, [createSetVotingDurationAction({ newVoteDuration, session })]);
}
