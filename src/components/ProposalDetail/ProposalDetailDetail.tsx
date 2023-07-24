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

interface ProposalDetailDetailProps {
  status: number;
  identifier: number;
  totalClaimed: string;
  reviewer: string;
  category: number;
}

export function ProposalDetailDetail({
  status,
  identifier,
  totalClaimed,
  reviewer,
  category,
}: ProposalDetailDetailProps) {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="title-2 mx-auto mt-8 max-w-5xl px-4 py-8 text-high-contrast">{t('detail')}</h2>
      <div className="mx-auto max-w-5xl px-1 md:px-4">
        <div className="rounded-xl bg-subtle px-8 py-4">
          <Info.Root>
            <Info.Item label={t('status')} value={String(status)}>
              <MdOutlineDoneAll size={24} />
            </Info.Item>
            <Info.Item label={t('identifier')} value={String(identifier)}>
              <MdOutlineFingerprint size={24} />
            </Info.Item>
            <Info.Item label={t('createdAt')} value="Jan 10th, 2023">
              <MdOutlineCalendarToday size={24} />
            </Info.Item>
            <Info.Item label={t('contact')} value="karyne@detroitledger.tech">
              <MdOutlineChatBubbleOutline size={24} />
            </Info.Item>
            <Info.Item label={t('totalClaimed')} value={totalClaimed}>
              <MdOutlineWhatshot size={24} />
            </Info.Item>
            {reviewer && (
              <Info.Item label={t('reviewer')} value={reviewer}>
                <MdOutlineRemoveRedEye size={24} />
              </Info.Item>
            )}
            <Info.Item label={t('totalRequested')} value="12,000.00 USD">
              <MdOutlineAttachMoney size={24} />
            </Info.Item>
            <Info.Item label={t('category')} value={String(category)}>
              <MdOutlineLabel size={24} />
            </Info.Item>
          </Info.Root>
        </div>
      </div>
    </>
  );
}
