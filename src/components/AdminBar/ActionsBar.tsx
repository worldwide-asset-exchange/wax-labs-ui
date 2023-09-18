import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Proposal } from '@/api/models/proposal.ts';
import { Approve } from '@/components/AdminBar/proposalStates/Approve.tsx';
import { CancelProposal } from '@/components/AdminBar/proposalStates/CancelProposal.tsx';
import { UpdateReviewer } from '@/components/AdminBar/proposalStates/UpdateReviewer.tsx';
import { Link } from '@/components/Link.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useIsAdmin } from '@/hooks/useIsAdmin.ts';

export function ActionsBar({
  proposal,
  onChange,
}: {
  proposal: Proposal;
  onChange: (status: ProposalStatusKey) => void;
}) {
  const isAdmin = useIsAdmin();
  const { actor } = useChain();
  const { t } = useTranslation();

  console.log(proposal);

  const render: ReactNode[] = [];

  const inDraft = [ProposalStatusKey.DRAFTING, ProposalStatusKey.FAILED_DRAFT].includes(proposal.status);

  if (inDraft) {
    render.push(
      <Link to="edit?step=1" variant="primary" key="edit">
        {t('edit')}
      </Link>
    );
  }

  if (
    isAdmin &&
    [
      ProposalStatusKey.FAILED_DRAFT,
      ProposalStatusKey.SUBMITTED_OR_DELIVERABLE_IN_PROGRESS,
      ProposalStatusKey.APPROVED_OR_REPORTED,
      ProposalStatusKey.VOTING_OR_ACCEPTED,
    ].includes(proposal.status)
  ) {
    render.push(<UpdateReviewer proposal={proposal} onChange={onChange} key="update-reviewer" />);
  }

  if (isAdmin && proposal.reviewer && proposal.status === ProposalStatusKey.SUBMITTED_OR_DELIVERABLE_IN_PROGRESS) {
    render.push(<Approve proposal={proposal} onChange={onChange} key="approve" />);
  }

  if (
    (isAdmin || actor === proposal.proposer) &&
    [
      ProposalStatusKey.DRAFTING,
      ProposalStatusKey.FAILED_DRAFT,
      ProposalStatusKey.SUBMITTED_OR_DELIVERABLE_IN_PROGRESS,
      ProposalStatusKey.APPROVED_OR_REPORTED,
      ProposalStatusKey.VOTING_OR_ACCEPTED,
    ].includes(proposal.status)
  ) {
    render.push(<CancelProposal proposal={proposal} onChange={onChange} key="cancel" />);
  }

  if (render) {
    return <div className="flex flex-nowrap gap-4">{render}</div>;
  }

  return null;
}
