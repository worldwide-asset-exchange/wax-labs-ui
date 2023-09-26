import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cancelProposal } from '@/api/chain/proposals';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useAdminProposalBar } from '@/hooks/useAdminProposalBar';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

export function CancelProposal() {
  const { proposal, onChangeStatus } = useAdminProposalBar();

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

      toast({ description: t('admin.cancel.cancelProposalSuccess'), variant: 'success' });

      onChangeStatus(ProposalStatusKey.CANCELLED);
    } catch (e) {
      console.log('Cancel Proposal', e);
    }
  };

  return (
    <>
      <Button variant="link" square onClick={() => setOpen(true)}>
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
