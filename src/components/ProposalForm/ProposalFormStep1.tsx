import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { configData } from '@/api/chain/proposals';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { ToggleField } from '@/components/ToggleField';

export function ProposalFormStep1() {
  const { t } = useTranslation();

  const { data: configs, isLoading } = useQuery({
    queryKey: ['configs'],
    queryFn: () => configData().then(response => response),
  });

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mx-auto max-w-5xl p-1 md:px-4 md:py-8">
      <div className="space-y-6 rounded-xl bg-subtle p-8">
        <Input
          {...register('title')}
          error={errors.title?.message as string}
          label={t('title') as string}
          placeholder={t('titlePlaceholder') as string}
          maxLength={64}
        />
        <TextArea
          {...register('shortDescription')}
          error={errors.shortDescription?.message as string}
          label={t('shortDescription') as string}
          placeholder={t('shortDescriptionPlaceholder') as string}
          rows={2}
          maxLength={160}
        />
        <fieldset>
          <legend className="label-1 mb-2 text-high-contrast">{t('category')}</legend>
          <div className="flex flex-wrap gap-1">
            {isLoading ? (
              <>
                <div className="h-12 w-32 rounded-md bg-ui-element" />
                <div className="h-12 w-32 rounded-md bg-ui-element" />
                <div className="h-12 w-32 rounded-md bg-ui-element" />
              </>
            ) : (
              <>
                {configs?.categories.map((category, index) => (
                  <ToggleField {...register('category')} key={category} type="radio" label={category} value={index} />
                ))}
              </>
            )}
          </div>
          {errors.category && (
            <span className="body-3 mt-2 block text-[#ED6E6D]">{errors.category?.message as string}</span>
          )}
        </fieldset>
        <Input
          {...register('contact')}
          error={errors.contact?.message as string}
          label={t('contact') as string}
          placeholder={t('contactPlaceholder') as string}
          maxLength={64}
        />
      </div>
    </div>
  );
}
