import { parse } from 'marked';
import { useTranslation } from 'react-i18next';

interface ProposalDetailOverviewProps {
  imageURL: string;
  content: string;
  financialRoadMap: string;
}

export function ProposalDetailOverview({ imageURL, content, financialRoadMap }: ProposalDetailOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <h2 className="title-2 pt-8 text-high-contrast">{t('overview')}</h2>
      {imageURL && (
        <div className="flex max-h-[32rem] items-center justify-center overflow-hidden rounded-xl bg-subtle">
          <img src={imageURL} alt="" className="w-full" />
        </div>
      )}
      <div
        className="body-1 text-low-contrast"
        dangerouslySetInnerHTML={{
          __html: parse(content, {
            gfm: true,
            breaks: true,
          }),
        }}
      />
      <h2 className="title-2 pt-8 text-high-contrast">{t('financialRoadMap')}</h2>
      <div
        className="body-1 text-low-contrast"
        dangerouslySetInnerHTML={{
          __html: parse(financialRoadMap, {
            gfm: true,
            breaks: true,
          }),
        }}
      />
    </div>
  );
}
