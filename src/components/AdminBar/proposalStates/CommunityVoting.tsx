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

function CommunityVotingComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const { session } = useChain();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onCommunityApproval = async () => {
    try {
      await reviewProposal({
        session: session!,
        proposalId: proposal!.proposal_id,
        memo: '',
        approve: true,
        draft: true,
      });
      await refreshStatus(proposal!.proposal_id);

      toast({ description: t('admin.approve.approveProposalSuccess'), variant: 'success' });

      await onChangeStatus(ProposalStatusKey.APPROVED);
    } catch (e) {
      console.log('onCommunityApproval error: ', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpen(true)}>
        {t('admin.approve.communityVoting')}
      </Button>

      <AlertDialog.Root
        open={open}
        onOpenChange={setOpen}
        title={t('admin.approve.communityVoting')}
        description={t('admin.approve.communityVotingConfirmation')}
      >
        <AlertDialog.Action onClick={onCommunityApproval}>{t('submit')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}

export const CommunityVoting = forwardRef(CommunityVotingComponent);
