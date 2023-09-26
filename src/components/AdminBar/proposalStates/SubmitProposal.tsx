import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { submitProposal } from '@/api/chain/proposals';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useAdminProposalBar } from '@/hooks/useAdminProposalBar';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

export function SubmitProposal() {
  const { proposal, onChangeStatus } = useAdminProposalBar();

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

      toast({ description: t('admin.submit.submitProposalSuccess'), variant: 'success' });

      onChangeStatus(ProposalStatusKey.SUBMITTED);
    } catch (e) {
      console.log('Cancel Proposal', e);
    }
  };

  return (
    <>
      <Button variant="link" square onClick={() => setOpen(true)}>
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
