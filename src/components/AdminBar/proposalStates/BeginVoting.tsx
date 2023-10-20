import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { beginVoting } from '@/api/chain/proposals';
import { refreshStatus } from '@/api/notifications.ts';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';
import { randomEosioName } from '@/utils/proposalUtils.ts';

function BeginVotingComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const { session } = useChain();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onBeginVoting = async () => {
    try {
      await Promise.all([
        beginVoting({
          session: session!,
          ballotName: randomEosioName(),
          proposalId: proposal!.proposal_id,
        }),
        refreshStatus(proposal!.proposal_id),
      ]);

      toast({ description: t('admin.voting.votingProposalSuccess'), variant: 'success' });

      onChangeStatus(ProposalStatusKey.VOTING);
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpen(true)}>
        {t('admin.voting.beginVoting')}
      </Button>

      <AlertDialog.Root
        open={open}
        onOpenChange={setOpen}
        title={t('admin.voting.beginVoting')}
        description={t('admin.voting.beginVotingConfirmation')}
      >
        <AlertDialog.Action onClick={onBeginVoting}>{t('submit')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}

export const BeginVoting = forwardRef(BeginVotingComponent);
