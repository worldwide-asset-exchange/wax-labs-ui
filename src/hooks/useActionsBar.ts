import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useIsAdmin } from '@/hooks/useIsAdmin.ts';

import { useSingleProposal } from './useSingleProposal';

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
  reject: [ProposalStatusKey.SUBMITTED],
  beginVoting: [ProposalStatusKey.APPROVED],
  endVoting: [ProposalStatusKey.VOTING],
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
  const { data: proposal } = useSingleProposal();

  const { actor } = useChain();
  const isAdmin = useIsAdmin();
  const isProposer = proposal!.proposer === actor;
  const isAdminOrProposer = isAdmin || isProposer;

  const showEdit = isProposer && actionsPerStatus.edit.includes(proposal!.status);
  const showSubmit = isProposer && actionsPerStatus.submit.includes(proposal!.status);
  const showUpdateReviewer = isAdmin && actionsPerStatus.updateReviewer.includes(proposal!.status);
  const showApprove = isAdmin && proposal!.reviewer && actionsPerStatus.approve.includes(proposal!.status);

  const showBeginVoting = isProposer && actionsPerStatus.beginVoting.includes(proposal!.status);
  const showEndVoting = isAdminOrProposer && actionsPerStatus.endVoting.includes(proposal!.status);

  const showCancelProposal = isAdminOrProposer && actionsPerStatus.cancelProposal.includes(proposal!.status);
  const showDelete = isAdminOrProposer && actionsPerStatus.delete.includes(proposal!.status);

  const showReject = isAdmin && actionsPerStatus.reject.includes(proposal!.status);

  const showActionButton =
    showEdit ||
    showSubmit ||
    showUpdateReviewer ||
    showApprove ||
    showBeginVoting ||
    showEndVoting ||
    showCancelProposal ||
    showReject ||
    showDelete;

  return {
    showActionButton,

    showEdit,
    showSubmit,
    showUpdateReviewer,
    showApprove,
    showBeginVoting,
    showEndVoting,
    showCancelProposal,
    showDelete,
    showReject,
  };
}
