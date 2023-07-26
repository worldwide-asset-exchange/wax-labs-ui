import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from '@wharfkit/session';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { setVotingDurationAction } from '@/api/chain/admin';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfigData } from '@/hooks/useConfigData.ts';

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
  const { reCache } = useConfigData();

  const VotingPeriodSchema = useMemo(() => {
    return z.object({
      days: z.preprocess(
        val => Number(val),
        z
          .number()
          .min(0, t('timeError') as string)
          .nonnegative(t('timeError') as string)
      ),
      hours: z.preprocess(
        val => Number(val),
        z
          .number()
          .min(0, t('timeError') as string)
          .nonnegative(t('timeError') as string)
      ),
      minutes: z.preprocess(
        val => Number(val),
        z
          .number()
          .min(0, t('timeError') as string)
          .nonnegative(t('timeError') as string)
      ),
      seconds: z.preprocess(
        val => Number(val),
        z
          .number()
          .min(0, t('timeError') as string)
          .nonnegative(t('timeError') as string)
      ),
    });
  }, [t]);

  type VotingPeriod = z.output<typeof VotingPeriodSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<VotingPeriod>({
    resolver: zodResolver(VotingPeriodSchema),
    defaultValues,
  });

  function setVotingPeriod({ days, hours, minutes, seconds }: VotingPeriod) {
    const newVoteDuration = days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds;

    setVotingDurationAction({
      newVoteDuration,
      session: session as Session,
    }).then(() => reCache());
  }

  return (
    <form onSubmit={handleSubmit(setVotingPeriod)} className="flex gap-6 rounded-xl bg-subtle p-8 max-md:flex-col">
      <div className="flex-1">
        <Input
          {...register('days')}
          error={errors.days?.message}
          label={t('days') as string}
          type="number"
          maxLength={16}
        />
      </div>
      <div className="flex-1">
        <Input
          {...register('hours')}
          error={errors.hours?.message}
          label={t('hours') as string}
          type="number"
          maxLength={16}
        />
      </div>
      <div className="flex-1">
        <Input
          {...register('minutes')}
          error={errors.minutes?.message}
          label={t('minutes') as string}
          type="number"
          maxLength={16}
        />
      </div>
      <div className="flex-1">
        <Input
          {...register('seconds')}
          error={errors.seconds?.message}
          label={t('seconds') as string}
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
  );
}
