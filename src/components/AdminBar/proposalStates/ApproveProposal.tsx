import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { skipVoting } from '@/api/chain/voting';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function ApproveProposalComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const { session } = useChain();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onApprove = async () => {
    try {
      await skipVoting({
        session: session!,
        proposalId: proposal!.proposal_id,
        memo: '',
      });

      toast({ description: t('admin.approve.approveProposalSuccess'), variant: 'success' });

      onChangeStatus(ProposalStatusKey.IN_PROGRESS);
    } catch (e) {
      console.log('onApprove error: ', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpen(true)}>
        {t('admin.approve.approveProposal')}
      </Button>

      <AlertDialog.Root
        open={open}
        onOpenChange={setOpen}
        title={t('admin.approve.approveProposal')}
        description={t('admin.approve.approveProposalConfirmation')}
      >
        <AlertDialog.Action onClick={onApprove}>{t('submit')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}

export const ApproveProposal = forwardRef(ApproveProposalComponent);
