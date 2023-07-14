import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import * as Header from '@/components/Header';
import { Input } from '@/components/Input';

export function Balance() {
  const { t } = useTranslation();
  const balance = '322.9200';

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
              {balance} {t('wax')}
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
