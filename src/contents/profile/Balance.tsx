import { Session } from '@wharfkit/session';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { accountBalance } from '@/api/chain/profile/query/accountBalance';
import { withdraw } from '@/api/chain/transfers';
import { Button } from '@/components/Button';
import * as Header from '@/components/Header';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';

interface WithdrawBalance {
  quantity: number;
}

export function Balance() {
  const { t } = useTranslation();
  const { actor, session } = useChain();

  const [balance, setBalance] = useState<number | null>(null);

  const withdrawBalance = (data: WithdrawBalance) => {
    withdraw({ quantity: data.quantity, session: session as Session });
    reset();
  };

  useEffect(() => {
    accountBalance({ accountName: actor as string }).then(response => {
      setBalance(response);
    });
  }, [actor]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormContext<WithdrawBalance>();

  return (
    <>
      <Header.Root>
        <Header.Title>{t('balance')}</Header.Title>
      </Header.Root>
      <div className="mx-auto flex max-w-7xl items-center px-4">
        <div className="w-full space-y-6 divide-y divide-subtle-light rounded-xl bg-subtle p-8">
          <div>
            <p className="label-2 text-low-contrast">{t('labsBalance')}</p>
            <h1 className="title-1 text-high-contrast">
              {balance ?? 0} {t('wax')}
            </h1>
          </div>
          <div className="flex w-full items-end gap-6 pt-6">
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
              <Button variant="primary" onClick={handleSubmit(withdrawBalance)}>
                {t('withdraw')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
