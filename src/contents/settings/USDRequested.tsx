import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from '@wharfkit/session';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { setMinRequested } from '@/api/chain/admin';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';

export function USDRequested() {
  const { t } = useTranslation();
  const { session } = useChain();

  const MinMaxUSDRequestSchema = useMemo(() => {
    return z.object({
      min: z
        .string()
        .nonempty(t('USDValueErrorEmpty') as string)
        .min(1),
      max: z
        .string()
        .nonempty(t('USDValueErrorEmpty') as string)
        .min(1),
    });
  }, [t]);

  type MinMaxUSDRequest = z.input<typeof MinMaxUSDRequestSchema>;

  const setMinMaxUSDRequest = (data: MinMaxUSDRequest) => {
    // TODO: Figure out how to set max as well
    setMinRequested({ minRequested: Number(data.min), session: session as Session });
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<MinMaxUSDRequest>({ resolver: zodResolver(MinMaxUSDRequestSchema) });

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
              maxLength={64}
            />
          </div>
          <div className="flex-1">
            <Input
              {...register('max')}
              error={errors.max?.message}
              label={t('maxUSDRequest') as string}
              placeholder={t('zeroPlaceholder') as string}
              maxLength={64}
            />
          </div>
          <div className="flex-none pt-8">
            <Button variant="primary" type="submit" disabled={!isDirty}>
              {t('set')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
