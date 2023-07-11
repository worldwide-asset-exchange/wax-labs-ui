import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Editor } from '@/components/Editor';

interface Step3Form {
  financialRoadMap: string;
}

export function ProposalFormStep3() {
  const { t } = useTranslation();

  const { control } = useFormContext<Step3Form>();

  return (
    <div className="mx-auto max-w-5xl p-1 md:px-4 md:py-8">
      <div className="rounded-xl bg-subtle p-8">
        <Controller
          control={control}
          name="financialRoadMap"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Editor label={t('financialRoadMap') as string} onChange={onChange} value={value} error={error?.message} />
          )}
        />
      </div>
    </div>
  );
}
