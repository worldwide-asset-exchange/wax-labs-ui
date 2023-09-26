import { ProposalStatusKey } from '@/constants.ts';
import { useAdminProposalBar } from '@/hooks/useAdminProposalBar';
import { useChain } from '@/hooks/useChain.ts';
import { useIsAdmin } from '@/hooks/useIsAdmin.ts';

const actionsPerStatus = {
  edit: [ProposalStatusKey.DRAFTING, ProposalStatusKey.FAILED_DRAFT],
  submit: [ProposalStatusKey.DRAFTING, ProposalStatusKey.FAILED_DRAFT],
  updateReviewer: [
    ProposalStatusKey.FAILED_DRAFT,
    ProposalStatusKey.SUBMITTED,
    ProposalStatusKey.APPROVED,
    ProposalStatusKey.VOTING,
  ],
  approve: [ProposalStatusKey.SUBMITTED],
  voting: [ProposalStatusKey.APPROVED, ProposalStatusKey.VOTING],
  cancelProposal: [
    ProposalStatusKey.DRAFTING,
    ProposalStatusKey.FAILED_DRAFT,
    ProposalStatusKey.SUBMITTED,
    ProposalStatusKey.APPROVED,
    ProposalStatusKey.VOTING,
  ],
  delete: [ProposalStatusKey.CANCELLED, ProposalStatusKey.FAILED, ProposalStatusKey.COMPLETED],
};

export function useActionsBar() {
  const { proposal } = useAdminProposalBar();

  const { actor } = useChain();
  const isAdmin = useIsAdmin();
  const isProposer = proposal!.proposer === actor;
  const isAdminOrProposer = isAdmin || isProposer;

  const showEdit = isProposer && actionsPerStatus.edit.includes(proposal!.status);
  const showSubmit = isProposer && actionsPerStatus.submit.includes(proposal!.status);
  const showUpdateReviewer = isAdmin && actionsPerStatus.updateReviewer.includes(proposal!.status);
  const showApprove = isAdmin && proposal!.reviewer && actionsPerStatus.approve.includes(proposal!.status);
  const showVoting = isAdminOrProposer && actionsPerStatus.voting.includes(proposal!.status);
  const showCancelProposal = isAdminOrProposer && actionsPerStatus.cancelProposal.includes(proposal!.status);
  const showDelete = isAdminOrProposer && actionsPerStatus.delete.includes(proposal!.status);

  return {
    showEdit,
    showSubmit,
    showUpdateReviewer,
    showApprove,
    showVoting,
    showCancelProposal,
    showDelete,
  };
}
