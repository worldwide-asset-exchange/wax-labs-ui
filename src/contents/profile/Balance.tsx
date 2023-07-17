import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { accountBalance } from '@/api/chain/profile/query/accountBalance';
import { Button } from '@/components/Button';
import * as Header from '@/components/Header';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';

export function Balance() {
  const { t } = useTranslation();
  const { actor } = useChain();

  const [balance, setBalance] = useState<number | null>(null);

  const getBalance = async () => {
    const response = await accountBalance({ accountName: actor as string });
    setBalance(response);
    console.debug(response);
  };

  getBalance();

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
                // {...register('balance')}
                // error={errors.balance?.message}
                label={t('amount') as string}
                placeholder={t('balancePlaceholder') as string}
                maxLength={64}
              />
            </div>
            <div>
              <Button variant="primary" onClick={() => console.debug('Withdraw')}>
                {t('withdraw')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
