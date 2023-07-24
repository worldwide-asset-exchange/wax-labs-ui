import { useTranslation } from 'react-i18next';

interface ProposalDetailOverviewProps {
  content: string;
  financialRoadMap: string;
}

export function ProposalDetailOverview({ content, financialRoadMap }: ProposalDetailOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-5xl px-4">
      <h2 className="title-2 mt-8 py-8 text-high-contrast">{t('overview')}</h2>
      <div className="text-low-contrast" dangerouslySetInnerHTML={{ __html: content }} />
      <h2 className="title-2 mt-8 py-8 text-high-contrast">{t('financialRoadMap')}</h2>
      <div className="text-low-contrast" dangerouslySetInnerHTML={{ __html: financialRoadMap }} />
    </div>
  );
}
