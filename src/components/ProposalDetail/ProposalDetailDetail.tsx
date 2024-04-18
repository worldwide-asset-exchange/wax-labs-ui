import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  MdOutlineAttachMoney,
  MdOutlineCalendarToday,
  MdOutlineChatBubbleOutline,
  MdOutlineDoneAll,
  MdOutlineFingerprint,
  MdOutlineLabel,
  MdOutlineRemoveRedEye,
  MdOutlineWhatshot,
} from 'react-icons/md';

import * as Info from '@/components/Info';
import { DEFAULT_DATE_FORMAT } from '@/constants.ts';
import { useConfigData } from '@/hooks/useConfigData';
import { useDeliverables } from '@/hooks/useDeliverables.ts';
import { formatCurrency } from '@/utils/formatter.ts';

interface ProposalDetailDetailProps {
  status: number;
  memo: string;
  identifier: number;
  reviewer: string;
  category: number;
  lastUpdate: string;
  totalRequested: string;
  proposerContact: string;
}

export function ProposalDetailDetail({
  status,
  memo,
  identifier,
  reviewer,
  category,
  lastUpdate,
  totalRequested,
  proposerContact,
}: ProposalDetailDetailProps) {
  const { t } = useTranslation();

  const { data: deliverables, isLoading: isLoadingDeliverables } = useDeliverables({ proposalId: identifier });

  const { configs } = useConfigData();
  const categoryName = configs?.categories[category];

  const lastUpdatedDate = Date.parse(lastUpdate);
  const lastUpdateFormatted = lastUpdatedDate ? format(lastUpdatedDate, DEFAULT_DATE_FORMAT) : '-';

  const totalClaimedFormatted = formatCurrency(
    deliverables?.reduce((acc, curr) => acc + curr.claimable_wax_amount, 0) ?? 0
  );

  return (
    <>
      <h2 className="title-2 mx-auto mt-8 max-w-5xl px-4 py-8 text-high-contrast">{t('detail')}</h2>
      <div className="mx-auto max-w-5xl space-y-4 px-1 md:px-4">
        <div className="rounded-xl bg-subtle px-8 py-4">
          <Info.Root>
            <Info.Item label={t('status')} status={status}>
              <MdOutlineDoneAll size={24} />
            </Info.Item>
            {memo && <div className="py-4 text-low-contrast" dangerouslySetInnerHTML={{ __html: memo }} />}
          </Info.Root>
        </div>
        <div className="rounded-xl bg-subtle px-8 py-4">
          <Info.Root>
            <Info.Item label={t('identifier')} value={String(identifier)}>
              <MdOutlineFingerprint size={24} />
            </Info.Item>
            <Info.Item label={t('lastUpdate')} value={lastUpdateFormatted}>
              <MdOutlineCalendarToday size={24} />
            </Info.Item>
            <Info.Item label={t('contact')} value={proposerContact}>
              <MdOutlineChatBubbleOutline size={24} />
            </Info.Item>
            {!isLoadingDeliverables && (
              <Info.Item label={t('totalClaimed')} value={totalClaimedFormatted}>
                <MdOutlineWhatshot size={24} />
              </Info.Item>
            )}
            {reviewer && (
              <Info.Item label={t('reviewer')} value={reviewer}>
                <MdOutlineRemoveRedEye size={24} />
              </Info.Item>
            )}
            <Info.Item label={t('totalRequested')} value={totalRequested}>
              <MdOutlineAttachMoney size={24} />
            </Info.Item>
            <Info.Item label={t('category')} value={categoryName}>
              <MdOutlineLabel size={24} />
            </Info.Item>
          </Info.Root>
        </div>
      </div>
    </>
  );
}
