import { useTranslation } from 'react-i18next';

import { VotingPeriodForm } from '@/components/VotingPeriodForm';
import { useConfig } from '@/hooks/useConfig';

export function VotingPeriod() {
  const { t } = useTranslation();
  const { config, isLoadingConfig } = useConfig();

  let defaultValues = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (config?.vote_duration && config?.vote_duration > 0) {
    defaultValues = {
      days: Math.floor(config.vote_duration / (60 * 60 * 24)),
      hours: Math.floor((config.vote_duration / (60 * 60)) % 24),
      minutes: Math.floor((config.vote_duration / 60) % 60),
      seconds: Math.floor(config.vote_duration % 60),
    };
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('votingPeriod')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        {isLoadingConfig ? (
          <div className="flex animate-pulse gap-6 rounded-xl bg-subtle p-8 duration-150 max-md:flex-col">
            <div className="flex-1">
              <div className="mb-3 mt-1 h-4 w-1/2 rounded-md bg-ui-element" />
              <div className="h-12 rounded-md bg-ui-element" />
            </div>
            <div className="flex-1">
              <div className="mb-3 mt-1 h-4 w-1/2 rounded-md bg-ui-element" />
              <div className="h-12 rounded-md bg-ui-element" />
            </div>
            <div className="flex-1">
              <div className="mb-3 mt-1 h-4 w-1/2 rounded-md bg-ui-element" />
              <div className="h-12 rounded-md bg-ui-element" />
            </div>
            <div className="flex-1">
              <div className="mb-3 mt-1 h-4 w-1/2 rounded-md bg-ui-element" />
              <div className="h-12 rounded-md bg-ui-element" />
            </div>
            <div className="flex-1 pt-8">
              <div className="h-12 rounded-md bg-ui-element" />
            </div>
          </div>
        ) : (
          <VotingPeriodForm defaultValues={defaultValues} />
        )}
      </div>
    </div>
  );
}
