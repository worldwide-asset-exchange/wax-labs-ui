import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextArea } from '@/components/TextArea';

interface Step3Form {
  financialRoadMap: string;
}

export function ProposalFormStep3() {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
  } = useFormContext<Step3Form>();

  return (
    <div className="mx-auto max-w-5xl p-1 md:px-4 md:py-8">
      <div className="rounded-xl bg-subtle p-8">
        <TextArea
          {...register('financialRoadMap')}
          error={errors.financialRoadMap?.message}
          label={t('financialRoadMap') as string}
          placeholder={t('financialRoadMapPlaceholder') as string}
          rows={10}
          maxLength={4096}
        />
      </div>
    </div>
  );
}
