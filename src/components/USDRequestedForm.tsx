import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from '@wharfkit/session';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { setMaxRequested, setMinRequested } from '@/api/chain/admin';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfigData } from '@/hooks/useConfigData.ts';

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

  const MinMaxUSDRequestSchema = useMemo(() => {
    return z.object({
      min: z.preprocess(
        val => Number(val),
        z
          .number()
          .min(0, t('USDValueError') as string)
          .nonnegative(t('USDValueError') as string)
      ),
      max: z.preprocess(
        val => Number(val),
        z
          .number()
          .min(0, t('USDValueError') as string)
          .nonnegative(t('USDValueError') as string)
      ),
    });
  }, [t]);

  type MinMaxUSDRequest = z.output<typeof MinMaxUSDRequestSchema>;

  function setMinMaxUSDRequest({ min, max }: MinMaxUSDRequest) {
    Promise.all([
      setMinRequested({ minRequested: min, session: session as Session }),
      setMaxRequested({ maxRequested: max, session: session as Session }),
    ]).then(() => {
      reFetch();
    });
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<MinMaxUSDRequest>({
    resolver: zodResolver(MinMaxUSDRequestSchema),
    defaultValues,
  });

  return (
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
        <Button variant="primary" type="submit" disabled={!isDirty}>
          {t('set')}
        </Button>
      </div>
    </form>
  );
}
