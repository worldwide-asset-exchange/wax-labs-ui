import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Proposal } from '@/api/models/proposal.ts';
import { Approve } from '@/components/AdminBar/proposalStates/Approve.tsx';
import { CancelProposal } from '@/components/AdminBar/proposalStates/CancelProposal.tsx';
import { Delete } from '@/components/AdminBar/proposalStates/Delete.tsx';
import { SubmitProposal } from '@/components/AdminBar/proposalStates/SubmitProposal.tsx';
import { UpdateReviewer } from '@/components/AdminBar/proposalStates/UpdateReviewer.tsx';
import { Voting } from '@/components/AdminBar/proposalStates/Voting.tsx';
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
  const { actor } = useChain();
  const isAdmin = useIsAdmin();
  const isProposer = proposal.proposer === actor;

  const { t } = useTranslation();

  const render: ReactNode[] = [];

  const inDraft = [ProposalStatusKey.DRAFTING, ProposalStatusKey.FAILED_DRAFT].includes(proposal.status);

  if (inDraft && isProposer) {
    render.push(
      <Link to="edit?step=1" variant="primary" key="edit">
        {t('edit')}
      </Link>
    );

    render.push(<SubmitProposal proposal={proposal} onChange={onChange} key="submit-proposal" />);
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
    [ProposalStatusKey.APPROVED_OR_REPORTED, ProposalStatusKey.VOTING_OR_ACCEPTED].includes(proposal.status)
  ) {
    render.push(<Voting proposal={proposal} onChange={onChange} key="voting" />);
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

  if (
    (isAdmin || actor === proposal.proposer) &&
    [ProposalStatusKey.CANCELLED, ProposalStatusKey.FAILED_OR_CLAIMED, ProposalStatusKey.COMPLETED].includes(
      proposal.status
    )
  ) {
    render.push(<Delete proposal={proposal} onChange={onChange} key="delete" />);
  }

  if (render) {
    return <div className="flex flex-nowrap gap-4">{render}</div>;
  }

  return null;
}
