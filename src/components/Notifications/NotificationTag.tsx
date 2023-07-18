import { useTranslation } from 'react-i18next';

import { ProposalStatusKey } from '@/constants.ts';

export interface NotificationTagProps {
  tag: ProposalStatusKey;
}

export function NotificationTag({ tag }: NotificationTagProps) {
  const { t } = useTranslation();
  const { bgColor, textColor, trans } = toProposalStatusKey(tag);

  return (
    <span
      className={`${bgColor} ${textColor} flex items-center justify-center rounded-[19px] px-4 py-2 text-sm font-bold uppercase leading-[22px] tracking-[1.12px]`}
    >
      {t(trans)}
    </span>
  );
}

function toProposalStatusKey(statusKey: ProposalStatusKey): { bgColor: string; textColor: string; trans: string } {
  switch (statusKey) {
    case ProposalStatusKey.DRAFTING:
      return { bgColor: 'bg-[#173743]', textColor: 'text-[#57BFD4]', trans: 'inDrafting' };
    case ProposalStatusKey.SUBMITTED_OR_DELIVERABLE_IN_PROGRESS:
      return { bgColor: 'bg-[#212C59]', textColor: 'text-[#899CF8]', trans: 'inReview' };
    case ProposalStatusKey.APPROVED_OR_REPORTED:
      return { bgColor: 'bg-[#183832]', textColor: 'text-[#5AC2B3]', trans: 'approved' };
    case ProposalStatusKey.VOTING_OR_ACCEPTED:
      return { bgColor: 'bg-[#4A250D]', textColor: 'text-[#F09150]', trans: 'inVoting' };
    case ProposalStatusKey.REJECTED_OR_PROPOSAL_IN_PROGRESS:
      return { bgColor: 'bg-[#3F2353]', textColor: 'text-[#B57DE9]', trans: 'rejected' };
    case ProposalStatusKey.FAILED_OR_CLAIMED:
    case ProposalStatusKey.FAILED_DRAFT:
      return { bgColor: 'bg-[#4E2018]', textColor: 'text-[#E07258]', trans: 'failed' };
    case ProposalStatusKey.CANCELLED:
      return { bgColor: 'bg-[#4E1F21]', textColor: 'text-[#ED6E6D]', trans: 'cancelled' };
    default:
      return { bgColor: 'bg-[#213824]', textColor: 'text-[#7BBF7C]', trans: 'completed' };
  }
}
