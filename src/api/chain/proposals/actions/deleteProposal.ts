import { execute } from '@/api/chain/actions';
import createDeleteProposalAction, {
  CreateDeleteProposalAction,
} from '@/api/chain/proposals/actions/create/createDeleteProposalAction.ts';

export async function deleteProposal({ proposalId, session }: CreateDeleteProposalAction) {
  return await execute(session, [createDeleteProposalAction({ proposalId, session })]);
}
