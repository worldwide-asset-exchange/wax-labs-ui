import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { deleteProposal } from '@/api/chain/proposals';
import { refreshStatus } from '@/api/notifications.ts';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function DeleteComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useChain();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onDeleteProposal = async () => {
    try {
      await deleteProposal({
        session: session!,
        proposalId: proposal!.proposal_id,
      });
      await refreshStatus(proposal!.proposal_id);

      toast({ description: t('admin.delete.deleteProposalSuccess'), variant: 'success' });

      await onChangeStatus(proposal!.status);

      navigate('/proposals');
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setIsOpen(true)}>
        {t('admin.delete.deleteProposal')}
      </Button>

      <AlertDialog.Root
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t('admin.delete.deleteProposal')}
        description={t('admin.delete.deleteProposalConfirmation')}
      >
        <AlertDialog.Action onClick={onDeleteProposal}>{t('apply')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}

export const Delete = forwardRef(DeleteComponent);
