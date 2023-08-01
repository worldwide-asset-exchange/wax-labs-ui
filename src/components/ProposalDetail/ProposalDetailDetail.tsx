import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  MdOutlineAttachMoney,
  MdOutlineCalendarToday,
  MdOutlineDoneAll,
  MdOutlineFingerprint,
  MdOutlineLabel,
  MdOutlineRemoveRedEye,
  MdOutlineWhatshot,
} from 'react-icons/md';

import * as Info from '@/components/Info';
import { useConfigData } from '@/hooks/useConfigData';

interface ProposalDetailDetailProps {
  status: number;
  identifier: number;
  totalClaimed: string;
  reviewer: string;
  category: number;
  lastUpdate: string;
  totalRequested: string;
}

export function ProposalDetailDetail({
  status,
  identifier,
  totalClaimed,
  reviewer,
  category,
  lastUpdate,
  totalRequested,
}: ProposalDetailDetailProps) {
  const { t } = useTranslation();

  const { configs } = useConfigData();
  const categoryName = configs?.categories[category];

  const lastUpdateFormatted = format(new Date(lastUpdate), 'LLL Mo, uuuu');

  return (
    <>
      <h2 className="title-2 mx-auto mt-8 max-w-5xl px-4 py-8 text-high-contrast">{t('detail')}</h2>
      <div className="mx-auto max-w-5xl px-1 md:px-4">
        <div className="rounded-xl bg-subtle px-8 py-4">
          <Info.Root>
            <Info.Item label={t('status')} status={status}>
              <MdOutlineDoneAll size={24} />
            </Info.Item>
            <Info.Item label={t('identifier')} value={String(identifier)}>
              <MdOutlineFingerprint size={24} />
            </Info.Item>
            <Info.Item label={t('lastUpdate')} value={lastUpdateFormatted}>
              <MdOutlineCalendarToday size={24} />
            </Info.Item>
            {/* <Info.Item label={t('contact')} value="sample@exemple.com">
              <MdOutlineChatBubbleOutline size={24} />
            </Info.Item> */}
            <Info.Item label={t('totalClaimed')} value={totalClaimed}>
              <MdOutlineWhatshot size={24} />
            </Info.Item>
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
