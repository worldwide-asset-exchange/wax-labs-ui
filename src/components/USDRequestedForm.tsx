import { zodResolver } from '@hookform/resolvers/zod';
import { FormEvent, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { execute } from '@/api/chain/actions';
import createSetMaxRequestedAction from '@/api/chain/admin/actions/create/createSetMaxRequestedAction.ts';
import createSetMinRequestedAction from '@/api/chain/admin/actions/create/createSetMinRequestedAction.ts';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfigData } from '@/hooks/useConfigData.ts';
import { useToast } from '@/hooks/useToast';

interface USDRequestedFormProps {
  defaultValues: {
    min: number;
    max: number;
  };
}

export function USDRequestedForm({ defaultValues }: USDRequestedFormProps) {
  const { t } = useTranslation();
  const { session } = useChain();
  const { reFetch } = useConfigData();
  const { toast } = useToast();

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const MinMaxUSDRequestSchema = useMemo(() => {
    return z.object({
      min: z
        .preprocess(val => Number(val), z.number().min(0, t('USDValueError')!).nonnegative(t('USDValueError')!))
        .transform(v => Number(v)),
      max: z
        .preprocess(val => Number(val), z.number().min(0, t('USDValueError')!).nonnegative(t('USDValueError')!))
        .transform(v => Number(v)),
    });
  }, [t]);

  type MinMaxUSDRequest = z.output<typeof MinMaxUSDRequestSchema>;

  const openConfirmationModal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmationModalOpen(true);
  };

  function setMinMaxUSDRequest() {
    const { min, max } = MinMaxUSDRequestSchema.parse(getValues());

    const actions = [];
    if (min !== defaultValues.min) {
      actions.push(createSetMinRequestedAction({ minRequested: min, session: session! }));
    }

    if (max !== defaultValues.max) {
      actions.push(createSetMaxRequestedAction({ maxRequested: max, session: session! }));
    }

    if (!actions.length) {
      return false;
    }

    execute(session!, actions)
      .then(() => reFetch())
      .then(() => toast({ description: t('minMaxUSDRequestedSuccess'), variant: 'success' }))
      .catch(e => toast({ description: e.message, variant: 'error' }));
  }

  const {
    register,
    getValues,
    formState: { errors, isDirty },
  } = useForm<MinMaxUSDRequest>({
    resolver: zodResolver(MinMaxUSDRequestSchema),
    defaultValues,
  });

  return (
    <>
      <form onSubmit={openConfirmationModal} className="flex gap-6 rounded-xl bg-subtle p-8">
        <div className="flex-1">
          <Input
            {...register('min')}
            error={errors.min?.message}
            label={t('minUSDRequest')!}
            placeholder={t('zeroPlaceholder')!}
            mask="usd"
            maxLength={32}
          />
        </div>
        <div className="flex-1">
          <Input
            {...register('max')}
            error={errors.max?.message}
            label={t('maxUSDRequest')!}
            mask="usd"
            maxLength={32}
          />
        </div>
        <div className="flex-none pt-8">
          <Button variant="primary" type="submit" disabled={!isDirty}>
            {t('set')}
          </Button>
        </div>
      </form>
      <AlertDialog.Root
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
        title={t('minMaxUSDRequested')}
        description={t('minMaxUSDRequestedConfirmation')}
      >
        <AlertDialog.Action onClick={setMinMaxUSDRequest}>{t('set')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}
