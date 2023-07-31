import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Session } from '@wharfkit/session';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { accountBalance } from '@/api/chain/profile/query/accountBalance';
import { withdraw } from '@/api/chain/transfers';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';

export function Balance() {
  const { t } = useTranslation();
  const { actor, session } = useChain();

  const BalanceSchema = useMemo(() => {
    return z.object({
      quantity: z
        .string()
        .nonempty(t('withdrawBalanceErrorEmpty') as string)
        .min(1),
    });
  }, [t]);

  type WithdrawBalance = z.input<typeof BalanceSchema>;

  const withdrawBalance = (data: WithdrawBalance) => {
    withdraw({ quantity: Number(data.quantity), session: session as Session });
    reset();
  };

  const { data: balance } = useQuery({
    queryKey: ['balance', actor],
    queryFn: () => accountBalance({ actor: actor as string }).then(response => response ?? ''),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawBalance>({
    resolver: zodResolver(BalanceSchema),
    values: {
      quantity: String(balance),
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('balance')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        <div className="rounded-xl bg-subtle p-8">
          <p className="label-2 text-low-contrast">{t('labsBalance')}</p>
          <h3 className="title-1 mt-1 text-high-contrast">
            {balance || 0} {t('wax')}
          </h3>
          <form onSubmit={handleSubmit(withdrawBalance)} className="mt-8 flex gap-6 border-t border-subtle-light pt-8">
            <div className="flex-1">
              <Input
                {...register('quantity')}
                error={errors.quantity?.message}
                label={t('amount') as string}
                placeholder={t('balancePlaceholder') as string}
                maxLength={64}
              />
            </div>
            <div className="flex-none pt-8">
              <Button variant="primary" type="submit">
                {t('withdraw')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
