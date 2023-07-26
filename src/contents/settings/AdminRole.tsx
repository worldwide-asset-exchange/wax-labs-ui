import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from '@wharfkit/session';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { setAdmin } from '@/api/chain/admin';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfigData } from '@/hooks/useConfigData.ts';

export function AdminRole() {
  const { t } = useTranslation();
  const { session } = useChain();
  const { reCache } = useConfigData();

  const AccountSchema = useMemo(() => {
    return z.object({
      account: z
        .string()
        .nonempty(t('waxAccountErrorEmpty') as string)
        .min(1),
    });
  }, [t]);

  type WaxAccount = z.input<typeof AccountSchema>;

  const setNewAdmin = (data: WaxAccount) => {
    setAdmin({ newAdmin: data.account, session: session as Session }).then(() => {
      reCache();
      reset();
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<WaxAccount>({ resolver: zodResolver(AccountSchema) });

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('transferAdminRole')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        <form onSubmit={handleSubmit(setNewAdmin)} className="flex gap-6 rounded-xl bg-subtle p-8">
          <div className="flex-1">
            <Input
              {...register('account')}
              error={errors.account?.message}
              label={t('waxAccount') as string}
              placeholder={t('waxAccountPlaceholder') as string}
              maxLength={64}
            />
          </div>
          <div className="flex-none pt-8">
            <Button variant="primary" type="submit" disabled={!isDirty}>
              {t('transfer')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
