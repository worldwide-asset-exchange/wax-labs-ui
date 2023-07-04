import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';

interface Step2Form {
  imageURL: string;
  content: string;
}

export function ProposalFormStep2() {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
  } = useFormContext<Step2Form>();

  return (
    <div className="mx-auto max-w-5xl p-1 md:px-4 md:py-8">
      <div className="space-y-6 rounded-xl bg-subtle p-8">
        <Input {...register('imageURL')} error={errors.imageURL?.message} label={t('imageURL') as string} />
        <TextArea
          {...register('content')}
          error={errors.content?.message}
          label={t('content') as string}
          placeholder={t('contentPlaceholder') as string}
          rows={10}
          maxLength={4096}
        />
      </div>
    </div>
  );
}
