import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from '@wharfkit/session';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { setMaxRequested, setMinRequested } from '@/api/chain/admin';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfig } from '@/hooks/useConfig';

const initialMinMaxUSDRequested = { min: '0', max: '0' };

export function USDRequested() {
  const { t } = useTranslation();
  const { session } = useChain();

  const { config } = useConfig();

  const [currentMinMaxUSDRequested, setCurrentMinMaxUSDRequested] = useState(initialMinMaxUSDRequested);

  useEffect(() => {
    if (config?.min_requested && config?.max_requested) {
      setCurrentMinMaxUSDRequested({
        min: String(config.min_requested.split(' ')[0]),
        max: String(config.max_requested.split(' ')[0]),
      });
    } else {
      setCurrentMinMaxUSDRequested(initialMinMaxUSDRequested);
    }
  }, [config]);

  const MinMaxUSDRequestSchema = useMemo(() => {
    return z.object({
      min: z
        .string()
        .nonempty(t('USDValueError') as string)
        .refine(val => Number(val) >= 0, { message: t('USDValueError') as string }),
      max: z
        .string()
        .nonempty(t('USDValueError') as string)
        .refine(val => Number(val) >= 0, { message: t('USDValueError') as string }),
    });
  }, [t]);

  type MinMaxUSDRequest = z.input<typeof MinMaxUSDRequestSchema>;

  const setMinMaxUSDRequest = (data: MinMaxUSDRequest) => {
    setMinRequested({ minRequested: Number(data.min), session: session as Session });
    setMaxRequested({ maxRequested: Number(data.max), session: session as Session });
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MinMaxUSDRequest>({ resolver: zodResolver(MinMaxUSDRequestSchema), values: currentMinMaxUSDRequested });

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('minMaxUSDRequested')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        <form onSubmit={handleSubmit(setMinMaxUSDRequest)} className="flex gap-6 rounded-xl bg-subtle p-8">
          <div className="flex-1">
            <Input
              {...register('min')}
              error={errors.min?.message}
              label={t('minUSDRequest') as string}
              placeholder={t('zeroPlaceholder') as string}
              type="number"
              maxLength={32}
            />
          </div>
          <div className="flex-1">
            <Input
              {...register('max')}
              error={errors.max?.message}
              label={t('maxUSDRequest') as string}
              type="number"
              maxLength={32}
            />
          </div>
          <div className="flex-none pt-8">
            <Button variant="primary" type="submit">
              {t('set')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
