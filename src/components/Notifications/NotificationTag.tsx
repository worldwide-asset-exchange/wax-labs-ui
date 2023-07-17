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
      className={`bg-[${bgColor}] text-[${textColor}] flex items-center justify-center rounded-[19px] px-4 py-2 text-sm font-bold uppercase leading-[22px] tracking-[1.12px]`}
    >
      {t(trans)}
    </span>
  );
}

function toProposalStatusKey(statusKey: ProposalStatusKey): { bgColor: string; textColor: string; trans: string } {
  switch (statusKey) {
    case ProposalStatusKey.DRAFTING:
      return { bgColor: '#173743', textColor: '#57BFD4', trans: 'inDrafting' };
    case ProposalStatusKey.SUBMITTED:
      return { bgColor: '#212C59', textColor: '#899CF8', trans: 'inReview' };
    case ProposalStatusKey.APPROVED:
      return { bgColor: '#183832', textColor: '#5AC2B3', trans: 'approved' };
    case ProposalStatusKey.VOTING:
      return { bgColor: '#4A250D', textColor: '#F09150', trans: 'inVoting' };
    case ProposalStatusKey.PROPOSAL_IN_PROGRESS:
      return { bgColor: '#3F2353', textColor: '#B57DE9', trans: 'rejected' };
    case ProposalStatusKey.FAILED:
    case ProposalStatusKey.FAILED_DRAFT:
      return { bgColor: '#4E2018', textColor: '#E07258', trans: 'failed' };
    case ProposalStatusKey.CANCELLED:
      return { bgColor: '#4E1F21', textColor: '#ED6E6D', trans: 'cancelled' };
    default:
      return { bgColor: '#213824', textColor: '#7BBF7C', trans: 'completed' };
  }
}
