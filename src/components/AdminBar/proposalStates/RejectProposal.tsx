import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { reviewProposal } from '@/api/chain/reviewer/actions/reviewProposal.ts';
import { refreshStatus } from '@/api/notifications.ts';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function RejectProposalComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { session } = useChain();
  const { toast } = useToast();

  const onSubmit = async () => {
    try {
      await reviewProposal({
        session: session!,
        proposalId: proposal!.proposal_id,
        memo: '',
        approve: false,
        draft: false,
      });

      await refreshStatus(proposal!.proposal_id);

      toast({ description: t('admin.reject.rejectProposalSuccess'), variant: 'success' });

      await onChangeStatus(ProposalStatusKey.CANCELLED);
    } catch (e) {
      console.log('Reject Proposal', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpen(true)}>
        {t('admin.reject.rejectProposal')}
      </Button>

      <AlertDialog.Root
        open={open}
        onOpenChange={setOpen}
        title={t('admin.reject.rejectProposal')}
        description={t('admin.reject.rejectProposalConfirmation')}
      >
        <AlertDialog.Action onClick={onSubmit}>{t('apply')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}

export const RejectProposal = forwardRef(RejectProposalComponent);
