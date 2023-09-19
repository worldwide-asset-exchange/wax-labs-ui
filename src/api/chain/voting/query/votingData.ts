import { ballotOptions } from '@/api/chain/voting/query/ballotOptions.ts';
import { VotingData } from '@/api/models/voting.ts';
import { currencyToFloat } from '@/utils/parser.ts';

export async function votingData({ ballotName }: { ballotName: string }): Promise<VotingData> {
  try {
    const currentVote = await ballotOptions({ ballotName });

    if (currentVote) {
      const yesVotes = currentVote.options.find(option => option.key === 'yes');
      const noVotes = currentVote.options.find(option => option.key === 'no');
      const endTime = new Date(currentVote.end_time);

      return {
        yes: currencyToFloat(yesVotes?.value ?? null),
        no: currencyToFloat(noVotes?.value ?? null),
        endTime,
        ended: new Date() > endTime,
        endTimeString: currentVote.end_time,
      };
    }
  } catch (e) {
    console.error('[votingData] Error', e);
  }

  return {
    yes: 0,
    no: 0,
    endTime: null,
    endTimeString: null,
    ended: true,
  };
}
