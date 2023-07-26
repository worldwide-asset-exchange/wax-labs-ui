import { useTranslation } from 'react-i18next';

import { USDRequestedForm } from '@/components/USDRequestedForm';
import { useConfigData } from '@/hooks/useConfigData.ts';

export function USDRequested() {
  const { t } = useTranslation();

  const { configs, isLoadingConfig } = useConfigData();

  let defaultValues = {
    min: 0,
    max: 0,
  };

  if (configs?.min_requested && configs?.max_requested) {
    defaultValues = {
      min: Number(configs.min_requested.split(' ')[0]),
      max: Number(configs.max_requested.split(' ')[0]),
    };
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('minMaxUSDRequested')}</h2>
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
            <div className="flex-1 pt-8">
              <div className="h-12 rounded-md bg-ui-element" />
            </div>
          </div>
        ) : (
          <USDRequestedForm defaultValues={defaultValues} />
        )}
      </div>
    </div>
  );
}
