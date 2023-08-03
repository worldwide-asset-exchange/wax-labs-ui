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
        className="prose max-w-none text-low-contrast prose-h3:title-3 prose-p:body-1 prose-h3:my-2 prose-h3:text-high-contrast prose-p:my-2 prose-p:text-low-contrast prose-blockquote:my-4 prose-strong:text-low-contrast prose-pre:my-2 prose-pre:bg-subtle prose-pre:text-low-contrast prose-ol:my-2 prose-ul:my-2"
        dangerouslySetInnerHTML={{
          __html: parse(content, {
            gfm: true,
            breaks: true,
          }),
        }}
      />
      <h2 className="title-2 pt-8 text-high-contrast">{t('financialRoadMap')}</h2>
      <div
        className="prose max-w-none text-low-contrast prose-h3:title-3 prose-p:body-1 prose-h3:my-2 prose-h3:text-high-contrast prose-p:my-2 prose-p:text-low-contrast prose-blockquote:my-4 prose-strong:text-low-contrast prose-pre:my-2 prose-pre:bg-subtle prose-pre:text-low-contrast prose-ol:my-2 prose-ul:my-2"
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
