import { useTranslation } from 'react-i18next';

import { beginVoting, endVoting } from '@/api/chain/proposals';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useAdminProposalBar } from '@/hooks/useAdminProposalBar';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';
import { randomEosioName } from '@/utils/proposalUtils.ts';

export function Voting() {
  const { proposal, onChangeStatus } = useAdminProposalBar();
  const { t } = useTranslation();
  const { actor, session } = useChain();
  const { toast } = useToast();

  const onBeginVoting = async () => {
    try {
      await beginVoting({
        session: session!,
        ballotName: randomEosioName(),
        proposalId: proposal!.proposal_id,
      });

      toast({ description: t('admin.voting.votingProposalSuccess'), variant: 'success' });

      onChangeStatus(ProposalStatusKey.VOTING);
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

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
      {proposal!.proposer === actor && proposal!.status === ProposalStatusKey.APPROVED && (
        <Button variant="tertiary" onClick={onBeginVoting}>
          {t('admin.voting.beginVoting')}
        </Button>
      )}
      {proposal!.status === ProposalStatusKey.VOTING && (
        <Button variant="tertiary" onClick={onEndVoting}>
          {t('admin.voting.endVoting')}
        </Button>
      )}
    </>
  );
}
