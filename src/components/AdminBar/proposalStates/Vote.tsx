import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { votingData } from '@/api/chain/voting';
import { vote } from '@/api/chain/voting/actions/vote.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { VotingData } from '@/api/models/voting.ts';
import { Button } from '@/components/Button.tsx';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

type QueriedVotesData = VotingData & { totalVotes: number; yesPercentage: string; noPercentage: string };

export function Vote({ proposal }: { proposal: Proposal }) {
  const { t } = useTranslation();
  const { session } = useChain();
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery<QueriedVotesData>({
    queryKey: ['proposal', proposal.ballot_name],
    queryFn: async () => {
      const votingData_ = await votingData({ ballotName: proposal.ballot_name });
      const totalVotes = votingData_.yes! + votingData_.no!;

      return {
        ...votingData_,
        totalVotes,
        yesPercentage: `${((votingData_.yes! * 100) / totalVotes).toFixed(0)}%`,
        noPercentage: `${((votingData_.no! * 100) / totalVotes).toFixed(0)}%`,
      } as QueriedVotesData;
    },
    enabled: !!proposal.ballot_name,
  });

  const onVote = async (yesVote: boolean) => {
    try {
      await vote({
        session: session!,
        ballotName: proposal.ballot_name,
        voteOption: yesVote ? 'yes' : 'no',
      });

      toast({ description: t('admin.voting.votingProposalSuccess'), variant: 'success' });

      await refetch();
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {!isLoading && data?.totalVotes && (
        <div className="mr-3 flex flex-col gap-2">
          <h4 className="title-3 text-high-contrast">{t('votes')}</h4>

          <div className="flex flex-row gap-4">
            <div className="flex flex-row gap-4">
              <p className="title-4 text-high-contrast">Yes</p>
              <span
                className="title-4 text-accent"
                style={{
                  width: `${data?.yesPercentage}`,
                }}
              >
                <h4 className="votesDisplay__percentage">{data?.yesPercentage}</h4>
              </span>
            </div>
            <div className="flex flex-row gap-4">
              <p className="title-4 text-high-contrast">No</p>
              <span
                className="title-4 text-accent"
                style={{
                  width: `${data?.noPercentage}`,
                }}
              >
                <h4 className="votesDisplay__percentage">{data?.noPercentage}</h4>
              </span>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !data?.totalVotes && (
        <p className="title-2 text-high-contrast">{data?.ended ? t('noVotes') : t('noVotesYet')}</p>
      )}

      {data?.ended && (
        <>
          <Button variant="primary" onClick={() => onVote(true)}>
            {t('yes')}
          </Button>
          <Button variant="secondary" onClick={() => onVote(false)}>
            {t('no')}
          </Button>
        </>
      )}
    </div>
  );
}
