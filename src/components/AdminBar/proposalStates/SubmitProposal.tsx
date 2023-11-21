import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { submitProposal } from '@/api/chain/proposals';
import { refreshStatus } from '@/api/notifications.ts';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function SubmitProposalComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { session } = useChain();
  const { toast } = useToast();

  const onSubmitProposal = async () => {
    try {
      await submitProposal({
        session: session!,
        proposalId: proposal!.proposal_id,
      });
      await refreshStatus(proposal!.proposal_id);

      toast({ description: t('admin.submit.submitProposalSuccess'), variant: 'success' });

      await onChangeStatus(ProposalStatusKey.SUBMITTED);
    } catch (e) {
      console.log('Cancel Proposal', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpen(true)}>
        {t('admin.submit.submitProposal')}
      </Button>

      <AlertDialog.Root
        open={open}
        onOpenChange={setOpen}
        title={t('admin.submit.submitProposal')}
        description={t('admin.submit.submitProposalConfirmation')}
      >
        <AlertDialog.Action onClick={onSubmitProposal}>{t('submit')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}

export const SubmitProposal = forwardRef(SubmitProposalComponent);
