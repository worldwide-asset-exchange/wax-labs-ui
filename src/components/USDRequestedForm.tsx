import { zodResolver } from '@hookform/resolvers/zod';
import { FormEvent, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { setMaxRequested, setMinRequested } from '@/api/chain/admin';
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
      min: z.preprocess(val => Number(val), z.number().min(0, t('USDValueError')!).nonnegative(t('USDValueError')!)),
      max: z.preprocess(val => Number(val), z.number().min(0, t('USDValueError')!).nonnegative(t('USDValueError')!)),
    });
  }, [t]);

  type MinMaxUSDRequest = z.output<typeof MinMaxUSDRequestSchema>;

  const openConfirmationModal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmationModalOpen(true);
  };

  function setMinMaxUSDRequest() {
    const { min, max } = getValues();

    Promise.all([
      setMinRequested({ minRequested: min, session: session! }),
      setMaxRequested({ maxRequested: max, session: session! }),
    ])
      .then(() => {
        reFetch();
        toast({ description: t('minMaxUSDRequestedSuccess'), variant: 'success' });
      })
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
            type="number"
            maxLength={32}
          />
        </div>
        <div className="flex-1">
          <Input
            {...register('max')}
            error={errors.max?.message}
            label={t('maxUSDRequest')!}
            type="number"
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
