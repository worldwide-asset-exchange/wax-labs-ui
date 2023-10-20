import { zodResolver } from '@hookform/resolvers/zod';
import { FormEvent, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { setVotingDurationAction } from '@/api/chain/admin';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfigData } from '@/hooks/useConfigData.ts';
import { useToast } from '@/hooks/useToast';

interface VotingPeriodFormProps {
  defaultValues: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export function VotingPeriodForm({ defaultValues }: VotingPeriodFormProps) {
  const { t } = useTranslation();
  const { session } = useChain();
  const { reFetch } = useConfigData();
  const { toast } = useToast();

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const VotingPeriodSchema = useMemo(() => {
    return z.object({
      days: z.preprocess(val => Number(val), z.number().min(0, t('timeError')!).nonnegative(t('timeError')!)),
      hours: z.preprocess(val => Number(val), z.number().min(0, t('timeError')!).nonnegative(t('timeError')!)),
      minutes: z.preprocess(val => Number(val), z.number().min(0, t('timeError')!).nonnegative(t('timeError')!)),
      seconds: z.preprocess(val => Number(val), z.number().min(0, t('timeError')!).nonnegative(t('timeError')!)),
    });
  }, [t]);

  type VotingPeriod = z.output<typeof VotingPeriodSchema>;

  const openConfirmationModal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmationModalOpen(true);
  };

  const {
    register,
    getValues,
    formState: { errors, isDirty },
  } = useForm<VotingPeriod>({
    resolver: zodResolver(VotingPeriodSchema),
    defaultValues,
  });

  function setVotingPeriod() {
    const { days, hours, minutes, seconds } = VotingPeriodSchema.parse(getValues());

    const newVoteDuration = days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds;

    setVotingDurationAction({
      newVoteDuration,
      session: session!,
    })
      .then(() => reFetch())
      .then(() => toast({ description: t('votingPeriodSuccess'), variant: 'success' }))
      .catch(e => toast({ description: e.message, variant: 'error' }));
  }

  return (
    <>
      <form onSubmit={openConfirmationModal} className="flex gap-6 rounded-xl bg-subtle p-8 max-md:flex-col">
        <div className="flex-1">
          <Input {...register('days')} error={errors.days?.message} label={t('days')!} type="number" maxLength={16} />
        </div>
        <div className="flex-1">
          <Input
            {...register('hours')}
            error={errors.hours?.message}
            label={t('hours')!}
            type="number"
            maxLength={16}
          />
        </div>
        <div className="flex-1">
          <Input
            {...register('minutes')}
            error={errors.minutes?.message}
            label={t('minutes')!}
            type="number"
            maxLength={16}
          />
        </div>
        <div className="flex-1">
          <Input
            {...register('seconds')}
            error={errors.seconds?.message}
            label={t('seconds')!}
            type="number"
            maxLength={16}
          />
        </div>
        <div className="flex-none pt-8">
          <Button variant="primary" type="submit" disabled={!isDirty}>
            {t('update')}
          </Button>
        </div>
      </form>
      <AlertDialog.Root
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
        title={t('votingPeriod')}
        description={t('votingPeriodConfirmation')}
      >
        <AlertDialog.Action onClick={setVotingPeriod}>{t('update')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}
