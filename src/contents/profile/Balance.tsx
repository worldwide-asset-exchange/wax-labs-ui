import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { FormEvent, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { accountBalance } from '@/api/chain/profile/query/accountBalance';
import { withdraw } from '@/api/chain/transfers';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfigData } from '@/hooks/useConfigData.ts';
import { useToast } from '@/hooks/useToast';

export function Balance() {
  const { t } = useTranslation();
  const { actor, session } = useChain();
  const { reFetch } = useConfigData();
  const { toast } = useToast();

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const openConfirmationModal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmationModalOpen(true);
  };

  const withdrawBalance = () => {
    const data = getValues();

    withdraw({ quantity: Number(data.quantity), session: session! })
      .then(() => reFetch())
      .then(() => {
        toast({ description: t('withdrawBalanceSuccess'), variant: 'success' });
        reset();
      })
      .catch(e => toast({ description: e.message, variant: 'error' }));
  };

  const { data: balance } = useQuery({
    queryKey: ['balance', actor],
    queryFn: () => accountBalance({ actor: actor! }),
  });

  const BalanceSchema = useMemo(() => {
    return z.object({
      quantity: z.coerce
        .number()
        .gt(0, t('withdrawBalanceErrorEmpty')!)
        .lte(Number(balance), t('withdrawBalanceErrorEmpty')!)
        .min(1, t('withdrawBalanceErrorEmpty')!),
    });
  }, [balance, t]);

  type WithdrawBalance = z.input<typeof BalanceSchema>;

  const {
    register,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<WithdrawBalance>({
    resolver: zodResolver(BalanceSchema),
    values: {
      quantity: Number(balance) || 0,
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('balance')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        <div className="rounded-xl bg-subtle p-8">
          <p className="label-2 text-low-contrast">{t('labsBalance')}</p>
          <h3 className="title-1 mt-1 text-high-contrast">
            {balance} {t('wax')}
          </h3>
          <form onSubmit={openConfirmationModal} className="mt-8 flex gap-6 border-t border-subtle-light pt-8">
            <div className="flex-1">
              <Input
                {...register('quantity')}
                error={errors.quantity?.message}
                label={t('amount')!}
                placeholder={t('balancePlaceholder')!}
                maxLength={64}
              />
            </div>
            <div className="flex-none pt-8">
              <Button variant="primary" type="submit" disabled={!isValid}>
                {t('withdraw')}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <AlertDialog.Root
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
        title={t('balance')}
        description={t('withdrawBalanceConfirmation')}
      >
        <AlertDialog.Action onClick={withdrawBalance}>{t('withdraw')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </div>
  );
}
