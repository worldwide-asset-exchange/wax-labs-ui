import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Editor } from '@/components/Editor';
import { Input } from '@/components/Input';

interface Step2Form {
  imageURL: string;
  content: string;
}

export function ProposalFormStep2() {
  const { t } = useTranslation();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<Step2Form>();

  return (
    <div className="mx-auto max-w-5xl p-1 md:px-4 md:py-8">
      <div className="space-y-6 rounded-xl bg-subtle p-8">
        <Input {...register('imageURL')} error={errors.imageURL?.message} label={t('imageURL') as string} />
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Editor label={t('content') as string} onChange={onChange} value={value} error={error?.message} />
          )}
        />
      </div>
    </div>
  );
}
