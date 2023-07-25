import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from '@wharfkit/session';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { setVotingDurationAction } from '@/api/chain/admin';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfig } from '@/hooks/useConfig';

const initialVotingPeriod = { days: '0', hours: '0', minutes: '0', seconds: '0' };

export function VotingPeriod() {
  const { t } = useTranslation();
  const { session } = useChain();

  const { config } = useConfig();

  const [currentVotingPeriod, setCurrentVotingPeriod] = useState(initialVotingPeriod);

  useEffect(() => {
    if (config?.vote_duration && config?.vote_duration > 0) {
      setCurrentVotingPeriod({
        days: String(Math.floor(config.vote_duration / (60 * 60 * 24))),
        hours: String(Math.floor((config.vote_duration / (60 * 60)) % 24)),
        minutes: String(Math.floor((config.vote_duration / 60) % 60)),
        seconds: String(Math.floor(config.vote_duration % 60)),
      });
    } else {
      setCurrentVotingPeriod(initialVotingPeriod);
    }
  }, [config]);

  const VotingPeriodSchema = useMemo(() => {
    return z.object({
      days: z
        .string()
        .nonempty(t('timeError') as string)
        .refine(val => Number(val) >= 0, { message: t('timeError') as string }),
      hours: z
        .string()
        .nonempty(t('timeError') as string)
        .refine(val => Number(val) >= 0, { message: t('timeError') as string }),
      minutes: z
        .string()
        .nonempty(t('timeError') as string)
        .refine(val => Number(val) >= 0, { message: t('timeError') as string }),
      seconds: z
        .string()
        .nonempty(t('timeError') as string)
        .refine(val => Number(val) >= 0, { message: t('timeError') as string }),
    });
  }, [t]);

  type VotingPeriod = z.input<typeof VotingPeriodSchema>;

  const votingPeriodToSeconds = (data: VotingPeriod) => {
    return Number(data.days) * 3600 * 24 + Number(data.hours) * 3600 + Number(data.minutes) * 60 + Number(data.seconds);
  };

  const setVotingPeriod = (data: VotingPeriod) => {
    setVotingDurationAction({ newVoteDuration: votingPeriodToSeconds(data), session: session as Session });
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VotingPeriod>({ resolver: zodResolver(VotingPeriodSchema), values: currentVotingPeriod });

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
            <Button variant="primary" type="submit">
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
