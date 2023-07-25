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

export function VotingPeriod() {
  const { t } = useTranslation();
  const { session } = useChain();

  const VotingPeriodSchema = useMemo(() => {
    return z.object({
      days: z
        .string()
        .nonempty(t('timeErrorEmpty') as string)
        .min(1),
      hours: z
        .string()
        .nonempty(t('timeErrorEmpty') as string)
        .min(1),
      minutes: z
        .string()
        .nonempty(t('timeErrorEmpty') as string)
        .min(1),
      seconds: z
        .string()
        .nonempty(t('timeErrorEmpty') as string)
        .min(1),
    });
  }, [t]);

  type VotingPeriod = z.input<typeof VotingPeriodSchema>;

  const setVotingPeriod = (data: VotingPeriod) => {
    // TODO: Verify how to convert days, hours, minutes and seconds to a single VoteDuration
    setVotingDurationAction({ newVoteDuration: Number(data.days), session: session as Session });
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<VotingPeriod>({ resolver: zodResolver(VotingPeriodSchema) });

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('votingPeriod')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        <form onSubmit={handleSubmit(setVotingPeriod)} className="flex gap-6 rounded-xl bg-subtle p-8">
          <div className="flex-1">
            <Input
              {...register('days')}
              error={errors.days?.message}
              label={t('days') as string}
              placeholder={t('zeroPlaceholder') as string}
              maxLength={4}
            />
          </div>
          <div className="flex-1">
            <Input
              {...register('hours')}
              error={errors.hours?.message}
              label={t('hours') as string}
              placeholder={t('zeroPlaceholder') as string}
              maxLength={2}
            />
          </div>
          <div className="flex-1">
            <Input
              {...register('minutes')}
              error={errors.minutes?.message}
              label={t('minutes') as string}
              placeholder={t('zeroPlaceholder') as string}
              maxLength={2}
            />
          </div>
          <div className="flex-1">
            <Input
              {...register('seconds')}
              error={errors.seconds?.message}
              label={t('seconds') as string}
              placeholder={t('zeroPlaceholder') as string}
              maxLength={2}
            />
          </div>
          <div className="flex-none pt-8">
            <Button variant="primary" type="submit" disabled={!isDirty}>
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
