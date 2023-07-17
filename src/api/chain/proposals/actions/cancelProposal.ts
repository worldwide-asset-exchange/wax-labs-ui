import { execute } from '@/api/chain/actions';
import createCancelProposalAction, {
  CreateCancelProposalAction,
} from '@/api/chain/proposals/actions/create/createCancelProposalAction.ts';

export async function cancelProposal({ memo, proposalId, session }: CreateCancelProposalAction) {
  return await execute(session, [createCancelProposalAction({ memo, proposalId, session })]);
}
