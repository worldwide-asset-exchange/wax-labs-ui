import { zodResolver } from '@hookform/resolvers/zod';
import { FormEvent, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { removeProfile } from '@/api/chain/profile';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useToast } from '@/hooks/useToast';

export function RemoveProfile() {
  const { t } = useTranslation();
  const { session } = useChain();
  const { toast } = useToast();

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const AccountSchema = useMemo(() => {
    return z.object({
      account: z.string().nonempty(t('waxAccountErrorEmpty')!).min(1),
    });
  }, [t]);

  type WaxAccount = z.input<typeof AccountSchema>;

  const openConfirmationModal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmationModalOpen(true);
  };

  const removeWaxAccountProfile = () => {
    const data = getValues();

    removeProfile({ waxAccount: data.account, session: session! })
      .then(() => {
        toast({ description: t('removeProfileSuccess'), variant: 'success' });
        reset();
      })
      .catch(e => toast({ description: e.message, variant: 'error' }));
  };

  const {
    register,
    getValues,
    reset,
    formState: { isDirty, errors },
  } = useForm<WaxAccount>({ resolver: zodResolver(AccountSchema) });

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('removeProfile')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        <form onSubmit={openConfirmationModal} className="flex gap-6 rounded-xl bg-subtle p-8">
          <div className="flex-1">
            <Input
              {...register('account')}
              error={errors.account?.message}
              label={t('waxAccount')!}
              placeholder={t('waxAccountPlaceholder')!}
              maxLength={64}
            />
          </div>
          <div className="flex-none pt-8">
            <Button variant="primary" type="submit" disabled={!isDirty}>
              {t('remove')}
            </Button>
          </div>
        </form>
      </div>
      <AlertDialog.Root
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
        title={t('removeProfile')}
        description={t('removeProfileConfirmation')}
      >
        <AlertDialog.Action onClick={removeWaxAccountProfile}>{t('remove')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </div>
  );
}
