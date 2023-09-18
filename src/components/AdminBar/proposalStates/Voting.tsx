import { useTranslation } from 'react-i18next';

import { beginVoting, endVoting } from '@/api/chain/proposals';
import { Proposal } from '@/api/models/proposal.ts';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';
import { randomEosioName } from '@/utils/proposalUtils.ts';

export function Voting({ proposal, onChange }: { proposal: Proposal; onChange: (status: ProposalStatusKey) => void }) {
  const { t } = useTranslation();
  const { actor, session } = useChain();
  const { toast } = useToast();

  const onBeginVoting = async () => {
    try {
      await beginVoting({
        session: session!,
        ballotName: randomEosioName(),
        proposalId: proposal.proposal_id,
      });

      toast({ description: t('admin.voting.votingProposalSuccess'), variant: 'success' });

      onChange(ProposalStatusKey.VOTING_OR_ACCEPTED);
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  const onEndVoting = async () => {
    try {
      await endVoting({
        session: session!,
        proposalId: proposal.proposal_id,
      });

      toast({ description: t('admin.voting.endVotingProposalSuccess'), variant: 'success' });

      onChange(ProposalStatusKey.VOTING_OR_ACCEPTED);
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <>
      {proposal.proposer === actor && proposal.status === ProposalStatusKey.APPROVED_OR_REPORTED && (
        <Button variant="tertiary" onClick={onBeginVoting}>
          {t('admin.voting.beginVoting')}
        </Button>
      )}
      {proposal.status === ProposalStatusKey.VOTING_OR_ACCEPTED && (
        <Button variant="tertiary" onClick={onEndVoting}>
          {t('admin.voting.endVoting')}
        </Button>
      )}
    </>
  );
}
