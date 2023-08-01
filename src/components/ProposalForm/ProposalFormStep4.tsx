import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineDelete, MdOutlineMoveDown, MdOutlineMoveUp } from 'react-icons/md';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Step4Form {
  deliverables: {
    description: string;
    recipient: string;
    daysToComplete: string;
    requestedUSD: string;
  }[];
}

export function ProposalFormStep4() {
  const { t } = useTranslation();

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<Step4Form>();

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'deliverables',
  });

  const watchedDeliverables = watch('deliverables', []);

  function handleAppend() {
    append({ description: '', recipient: '', daysToComplete: '', requestedUSD: '' });
  }

  function handleSwapUp(index: number) {
    const to = index - 1;
    if (to < 0) {
      swap(index, fields.length - 1);
    } else {
      swap(index, to);
    }
  }

  function handleSwapDown(index: number) {
    const to = index + 1;
    const lastIndex = fields.length;

    if (to === lastIndex) {
      swap(index, 0);
    } else {
      swap(index, to);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-1 p-1 md:space-y-4 md:px-4 md:py-8">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="divide-y divide-subtle-light rounded-xl bg-subtle focus-within:ring-1 focus-within:ring-accent-dark"
        >
          <div className="flex items-center gap-2 p-8">
            <div className="flex flex-1 items-center gap-4 overflow-hidden">
              <div className="title-3 flex h-14 w-14 flex-none items-center justify-center rounded-full border-2 border-high-contrast text-high-contrast">
                {index + 1}
              </div>
              <div className="title-3 flex-1 truncate text-high-contrast max-md:hidden">
                {watchedDeliverables.length > 0 && watchedDeliverables[index].description
                  ? watchedDeliverables[index].description
                  : t('deliverable')}
              </div>
            </div>
            <div className="flex flex-none gap-2">
              <Button onClick={() => handleSwapDown(index)} square>
                <MdOutlineMoveDown size={24} />
              </Button>
              <Button onClick={() => handleSwapUp(index)} square>
                <MdOutlineMoveUp size={24} />
              </Button>
              <Button onClick={() => remove(index)} square>
                <MdOutlineDelete size={24} />
              </Button>
            </div>
          </div>
          <div className="space-y-6 p-8">
            <Input
              {...register(`deliverables.${index}.description` as const)}
              label={t('description')!}
              error={errors.deliverables?.[index]?.description?.message}
            />
            <div className="flex gap-6 max-md:flex-col">
              <div className="flex-1">
                <Input
                  {...register(`deliverables.${index}.recipient` as const)}
                  label={t('recipient')!}
                  error={errors.deliverables?.[index]?.recipient?.message}
                />
              </div>
              <div className="flex-1">
                <Input
                  {...register(`deliverables.${index}.daysToComplete` as const)}
                  label={t('daysToComplete')!}
                  placeholder={t('daysToCompletePlaceholder')!}
                  error={errors.deliverables?.[index]?.daysToComplete?.message}
                />
              </div>
              <div className="flex-1">
                <Input
                  {...register(`deliverables.${index}.requestedUSD` as const)}
                  label={t('requestedUSD')!}
                  placeholder={t('requestedUSDPlaceholder')!}
                  error={errors.deliverables?.[index]?.requestedUSD?.message}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div
        data-error={!!errors.deliverables?.message}
        className="flex flex-col items-center justify-center gap-2 rounded-xl bg-subtle p-8 data-[error=true]:border data-[error=true]:border-[#ED6E6D]"
      >
        <Button onClick={handleAppend}>{t('newDeliverable')}</Button>
        {errors.deliverables?.message && <span className="body-3 text-[#ED6E6D]">{errors.deliverables.message}</span>}
      </div>
    </div>
  );
}
