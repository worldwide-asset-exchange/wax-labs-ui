import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { endVoting } from '@/api/chain/proposals';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function EndVotingComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const { session } = useChain();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onEndVoting = async () => {
    try {
      await endVoting({
        session: session!,
        proposalId: proposal!.proposal_id,
      });

      toast({ description: t('admin.voting.endVotingProposalSuccess'), variant: 'success' });

      onChangeStatus(ProposalStatusKey.VOTING);
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpen(true)}>
        {t('admin.voting.endVoting')}
      </Button>

      <AlertDialog.Root
        open={open}
        onOpenChange={setOpen}
        title={t('admin.voting.endVoting')}
        description={t('admin.voting.endVotingConfirmation')}
      >
        <AlertDialog.Action onClick={onEndVoting}>{t('submit')}</AlertDialog.Action>
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </>
  );
}

export const EndVoting = forwardRef(EndVotingComponent);
