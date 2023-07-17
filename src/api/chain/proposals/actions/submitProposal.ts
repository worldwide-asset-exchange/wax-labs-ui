import { execute } from '@/api/chain/actions';
import createSubmitProposalAction, {
  CreateSubmitProposalAction,
} from '@/api/chain/proposals/actions/create/createSubmitProposalAction.ts';

export async function submitProposal({ proposalId, session }: CreateSubmitProposalAction) {
  return await execute(session, [createSubmitProposalAction({ proposalId, session })]);
}
