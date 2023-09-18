import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { deleteProposal } from '@/api/chain/proposals';
import { Proposal } from '@/api/models/proposal.ts';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

export function Delete({ proposal, onChange }: { proposal: Proposal; onChange: (status: ProposalStatusKey) => void }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useChain();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onDeleteProposal = async () => {
    try {
      await deleteProposal({
        session: session!,
        proposalId: proposal.proposal_id,
      });

      toast({ description: t('admin.delete.deleteProposalSuccess'), variant: 'success' });

      onChange(proposal.status);

      navigate('/proposals');
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <>
      <Button variant="tertiary" onClick={() => setIsOpen(true)}>
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
