import wax from '@/api/chain';
import { Proposal } from '@/api/models/proposal.ts';
import { INDEX_POSITION, KEY_TYPE, LABS_CONTRACT_ACCOUNT, ProposalFilterType, Tables } from '@/constants.ts';

export interface ProposalResponse {
  proposals: Proposal[] | null;
  next_key: string | null;
  more: boolean;
}

interface ProposalsFilter {
  queryType?: ProposalFilterType;
  lowerBound?: string;
  upperBound?: string;
}

async function _getProposalRangeLimit({
  queryType,
  lowerBound,
  upperBound,
}: ProposalsFilter): Promise<ProposalResponse> {
  const { rows, next_key, more } = await wax.rpc.get_table_rows({
    code: LABS_CONTRACT_ACCOUNT,
    scope: LABS_CONTRACT_ACCOUNT,
    table: Tables.PROPOSALS,
    json: true,
    ...(queryType != null ? { key_type: KEY_TYPE[queryType] } : {}),
    ...(queryType != null ? { INDEX_POSITION: INDEX_POSITION[queryType] } : {}),
    ...(lowerBound != null ? { lower_bound: lowerBound } : {}),
    ...(upperBound != null ? { upper_bound: upperBound } : {}),
    limit: 1000,
  });

  return { proposals: rows, next_key, more };
}

export async function getProposals({ queryType, lowerBound, upperBound }: ProposalsFilter): Promise<Proposal[]> {
  const proposalsArray: Proposal[] = [];

  let nextKey = lowerBound;

  try {
    for (;;) {
      const { proposals, more, next_key } = await _getProposalRangeLimit({
        queryType,
        upperBound,
        lowerBound: nextKey,
      });

      proposalsArray.push(...(proposals || []));

      if (!more) {
        break;
      }

      nextKey = next_key as string;
    }
  } catch (e) {
    console.error('[getProposals] Error', e);
  }

  return proposalsArray;
}
