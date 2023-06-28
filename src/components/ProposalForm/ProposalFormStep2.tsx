import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InputFile } from '@/components/InputFile';
import { TextArea } from '@/components/TextArea';
import { Proposal } from '@/layouts/ProposalFormLayout';

export function ProposalFormStep2() {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
  } = useFormContext<Proposal>();

  return (
    <div className="mx-auto max-w-5xl p-1 md:px-4 md:py-8">
      <div className="space-y-6 rounded-xl bg-subtle p-8">
        <InputFile
          {...register('coverImage')}
          error={errors.coverImage?.message as string}
          label={t('coverImage') as string}
          hint={t('coverImageHint') as string}
          accept="image/*"
        />
        <InputFile
          {...register('complementaryFile')}
          error={errors.complementaryFile?.message as string}
          label={t('complementaryFile') as string}
        />
        <TextArea
          {...register('content')}
          error={errors.content?.message as string}
          label={t('content') as string}
          placeholder={t('contentPlaceholder') as string}
          rows={10}
          maxLength={4096}
        />
      </div>
    </div>
  );
}
