import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  MdAttachMoney,
  MdFingerprint,
  MdOutlineCalendarToday,
  MdOutlineLabel,
  MdOutlinePerson,
  MdPlaylistAddCheck,
} from 'react-icons/md';
import { Link } from 'react-router-dom';

import { WAXCurrency } from '@/api/models/common.ts';
import { StatusTag } from '@/components/StatusTag';
import { DEFAULT_DATE_FORMAT, ProposalStatusKey } from '@/constants.ts';
import { useConfigData } from '@/hooks/useConfigData.ts';
import { formatCurrency } from '@/utils/formatter.ts';
import { toProposalStatus } from '@/utils/proposalUtils.ts';

interface ProposalItemProps {
  title: string;
  shortDescription: string;
  status: ProposalStatusKey;
  deliverables: number;
  id: string | number;
  requestedAmount: WAXCurrency;
  proposer: string;
  category: number;
  lastUpdate: string;
}

export function ProposalItem({
  title,
  shortDescription,
  status,
  deliverables,
  id,
  requestedAmount,
  proposer,
  category,
  lastUpdate,
}: ProposalItemProps) {
  const { t } = useTranslation();

  const { configs } = useConfigData();

  const lastUpdatedDate = Date.parse(lastUpdate);
  const lastUpdateFormatted = lastUpdatedDate ? format(lastUpdatedDate, DEFAULT_DATE_FORMAT) : '-';
  const categoryName = configs?.categories[category];

  const requestedAmountFormatted = formatCurrency(requestedAmount);

  return (
    <Link
      to={`/proposals/${id}`}
      className="group/proposal-item flex cursor-pointer flex-col divide-y divide-subtle-light overflow-hidden rounded-xl bg-subtle p-4 duration-150 hover:ring-1 hover:ring-accent-dark group-data-[view=list]/proposal-root:md:flex-row group-data-[view=list]/proposal-root:md:divide-y-0"
    >
      <div className="flex-1 space-y-4 p-4">
        <h3 className="title-3 text-high-contrast group-hover/proposal-item:text-accent">{title}</h3>
        <p className="body-2 text-low-contrast">{shortDescription}</p>
        <StatusTag status={toProposalStatus(status)} />
      </div>

      <div className="label-1 mx-4 flex-1 divide-y divide-subtle-light text-low-contrast">
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdPlaylistAddCheck size={24} />
            </div>
            <div className="flex-1 truncate">
              {deliverables} {t('deliverables')}
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdFingerprint size={24} />
            </div>
            <div className="flex-1 truncate">{id}</div>
          </div>
        </div>
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdAttachMoney size={24} />
            </div>
            <div className="flex-1 truncate">{requestedAmountFormatted}</div>
          </div>
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdOutlinePerson size={24} />
            </div>
            <div className="flex-1 truncate">{proposer}</div>
          </div>
        </div>
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdOutlineLabel size={24} />
            </div>
            <div className="flex-1 truncate">{categoryName}</div>
          </div>
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdOutlineCalendarToday size={24} />
            </div>
            <div className="flex-1 truncate">{lastUpdateFormatted}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
