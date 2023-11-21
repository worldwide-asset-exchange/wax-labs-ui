import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cancelProposal } from '@/api/chain/proposals';
import { refreshStatus } from '@/api/notifications.ts';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function CancelProposalComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { session } = useChain();
  const { toast } = useToast();

  const onSubmit = async () => {
    try {
      await cancelProposal({
        session: session!,
        proposalId: proposal!.proposal_id,
        memo: '',
      });
      await refreshStatus(proposal!.proposal_id);

      toast({ description: t('admin.cancel.cancelProposalSuccess'), variant: 'success' });

      await onChangeStatus(ProposalStatusKey.CANCELLED);
    } catch (e) {
      console.log('Cancel Proposal', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpen(true)}>
        {t('admin.cancel.cancelProposal')}
      </Button>

      <AlertDialog.Root
        open={open}
        onOpenChange={setOpen}
        title={t('admin.cancel.cancelProposal')}
        description={t('admin.cancel.cancelProposalConfirmation')}
      >
        <AlertDialog.Action onClick={onSubmit}>{t('apply')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}

export const CancelProposal = forwardRef(CancelProposalComponent);
