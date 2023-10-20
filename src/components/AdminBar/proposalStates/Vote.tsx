import * as Dialog from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MdOutlineClose, MdOutlineThumbDown, MdOutlineThumbUp } from 'react-icons/md';

import { votingData } from '@/api/chain/voting';
import { vote } from '@/api/chain/voting/actions/vote.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { VotingData } from '@/api/models/voting.ts';
import { VoteBar } from '@/components/AdminBar/proposalStates/VoteBar';
import { Button } from '@/components/Button.tsx';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

type QueriedVotesData = VotingData & { totalVotes: number; yesPercentage: string; noPercentage: string };

export function Vote({ proposal }: { proposal: Proposal }) {
  const { t } = useTranslation();
  const { session, actor } = useChain();
  const { toast } = useToast();

  const { data, refetch } = useQuery<QueriedVotesData>({
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
    <div className="border-b border-subtle-light bg-subtle">
      <div className="mx-auto max-w-5xl p-4">
        {data?.totalVotes ? (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <VoteBar yes={data?.yesPercentage} no={data?.noPercentage} />
            </div>

            {!data?.ended && actor !== proposal.proposer && (
              <div className="flex-0">
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <Button variant="secondary">{t('vote')}</Button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay" />
                    <Dialog.Content className="dialog-content">
                      <header className="dialog-header">
                        <Dialog.Close asChild>
                          <Button square variant="tertiary">
                            <MdOutlineClose size={24} />
                          </Button>
                        </Dialog.Close>
                        <Dialog.Title className="dialog-title">{t('vote')}</Dialog.Title>
                      </header>
                      <div className="space-y-4 p-4">
                        <VoteBar yes={data?.yesPercentage} no={data?.noPercentage} />

                        <Dialog.Description className="body-2 text-low-contrast">
                          {t('voteDescription')}
                        </Dialog.Description>

                        <div className="flex gap-4">
                          <Button variant="primary" onClick={() => onVote(true)}>
                            <MdOutlineThumbUp size={24} />
                            {t('yes')}
                          </Button>
                          <Button variant="secondary" onClick={() => onVote(false)}>
                            <MdOutlineThumbDown size={24} />
                            {t('no')}
                          </Button>
                        </div>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            )}
          </div>
        ) : (
          <div className="label-1 rounded-md bg-app p-2 text-center text-high-contrast">
            {data?.ended ? t('noVotes') : t('noVotesYet')}
          </div>
        )}
      </div>
    </div>
  );
}
