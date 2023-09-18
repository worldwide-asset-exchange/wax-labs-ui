import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { reviewProposal } from '@/api/chain/reviewer/actions/reviewProposal.ts';
import { skipVoting } from '@/api/chain/voting';
import { Proposal } from '@/api/models/proposal.ts';
import { InputDialog, InputDialogProps } from '@/components/AdminBar/InputDialog.tsx';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

export function Approve({ proposal, onChange }: { proposal: Proposal; onChange: (status: ProposalStatusKey) => void }) {
  const { t } = useTranslation();
  const [openRejectionResponse, setOpenRejectionResponse] = useState(false);
  const { session } = useChain();
  const { toast } = useToast();

  const onApprove = async () => {
    try {
      await skipVoting({
        session: session!,
        proposalId: proposal.proposal_id,
        memo: '',
      });

      toast({ description: t('admin.approve.approveProposalSuccess'), variant: 'success' });

      onChange(ProposalStatusKey.REJECTED_OR_PROPOSAL_IN_PROGRESS);
    } catch (e) {
      console.log('onApprove error: ', e);
    }
  };

  const onCommunityApproval = async () => {
    try {
      await reviewProposal({
        session: session!,
        proposalId: proposal.proposal_id,
        memo: '',
        approve: true,
        draft: true,
      });

      toast({ description: t('admin.approve.approveProposalSuccess'), variant: 'success' });

      onChange(ProposalStatusKey.APPROVED_OR_REPORTED);
    } catch (e) {
      console.log('onCommunityApproval error: ', e);
    }
  };

  const onAskForChanges: InputDialogProps['onSubmit'] = async ({ value }) => {
    try {
      await reviewProposal({
        session: session!,
        proposalId: proposal.proposal_id,
        memo: value,
        approve: false,
        draft: true,
      });

      toast({ description: t('admin.approve.approveProposalSuccess'), variant: 'success' });

      onChange(ProposalStatusKey.FAILED_DRAFT);
    } catch (e) {
      console.log('onCommunityApproval error: ', e);
    }
  };

  return (
    <>
      <Button variant="primary" square onClick={onApprove}>
        {t('admin.approve.approveProposal')}
      </Button>
      <Button variant="secondary" square onClick={onCommunityApproval}>
        {t('admin.approve.communityVoting')}
      </Button>
      <Button variant="tertiary" square onClick={() => setOpenRejectionResponse(true)}>
        {t('admin.approve.askForChanges')}
      </Button>

      <InputDialog
        label={t('admin.approve.enterRequiredChangesLabel')!}
        maxLength={350}
        open={openRejectionResponse}
        title={t('admin.approve.askForChanges')}
        onSubmit={onAskForChanges}
        type="textarea"
        onClose={() => setOpenRejectionResponse(false)}
      />
    </>
  );
}
