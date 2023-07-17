import { execute } from '@/api/chain/actions';
import createClaimFundsAction, {
  CreateClaimFundsAction,
} from '@/api/chain/proposals/actions/create/createClaimFundsAction.ts';

export async function claimFunds({ deliverableId, proposalId, session }: CreateClaimFundsAction) {
  return await execute(session, [createClaimFundsAction({ deliverableId, proposalId, session })]);
}
