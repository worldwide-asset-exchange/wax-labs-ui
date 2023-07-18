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
import * as Header from '@/components/Header';
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
    queryFn: () => accountBalance({ accountName: actor as string }).then(response => response ?? ''),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawBalance>({ resolver: zodResolver(BalanceSchema), values: { quantity: String(balance) } });

  return (
    <>
      <Header.Root>
        <Header.Title>{t('balance')}</Header.Title>
      </Header.Root>
      <form onSubmit={handleSubmit(withdrawBalance)} className="mx-auto flex max-w-7xl items-center px-4">
        <div className="w-full space-y-6 divide-y divide-subtle-light rounded-xl bg-subtle p-8">
          <div>
            <p className="label-2 text-low-contrast">{t('labsBalance')}</p>
            <h1 className="title-1 text-high-contrast">
              {balance ?? 0} {t('wax')}
            </h1>
          </div>
          <div className={`flex w-full ${errors.quantity?.message ? 'items-center' : 'items-end'} gap-6 pt-6`}>
            <div className="w-full">
              <Input
                {...register('quantity')}
                error={errors.quantity?.message}
                label={t('amount') as string}
                placeholder={t('balancePlaceholder') as string}
                maxLength={64}
              />
            </div>
            <div>
              <Button variant="primary" type="submit">
                {t('withdraw')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
