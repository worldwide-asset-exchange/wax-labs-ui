import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { Proposal } from '@/api/models/proposal.ts';
import { INDEX_POSITION, KEY_TYPE, LABS_CONTRACT_ACCOUNT, ProposalFilterType, Tables } from '@/constants.ts';

export interface ProposalResponse {
  proposals: Proposal[] | null;
  next_key: string | null;
  more: boolean;
}

interface ProposalsFilter {
  queryType?: ProposalFilterType;
  lowerBound?: number | string;
  upperBound?: number | string;
  returnFirstIteration?: boolean;
}

async function _getProposalRangeLimit({
  queryType,
  lowerBound,
  upperBound,
}: ProposalsFilter): Promise<ProposalResponse> {
  const data = {
    code: LABS_CONTRACT_ACCOUNT,
    scope: LABS_CONTRACT_ACCOUNT,
    table: Tables.PROPOSALS,
    json: true,
    ...(queryType != null ? { key_type: KEY_TYPE[queryType] } : {}),
    ...(queryType != null ? { index_position: INDEX_POSITION[queryType] } : {}),
    ...(lowerBound != null ? { lower_bound: lowerBound } : {}),
    ...(upperBound != null ? { upper_bound: upperBound } : {}),
    limit: 1000,
  };

  const { rows, next_key, more } = (await wax.rpc.get_table_rows(data)) as GetTableRowsResult<Proposal>;

  return { proposals: rows, next_key, more };
}

export async function getProposals({
  queryType,
  lowerBound,
  upperBound,
  returnFirstIteration,
}: ProposalsFilter): Promise<Proposal[]> {
  const proposalsArray: Proposal[] = [];

  let nextKey = lowerBound;

  try {
    for (;;) {
      const { proposals, more, next_key } = await _getProposalRangeLimit({
        queryType,
        upperBound,
        lowerBound: nextKey,
      });

      proposalsArray.push(...(proposals ?? []));

      nextKey = next_key as string;

      if (!more || returnFirstIteration) {
        break;
      }
    }
  } catch (e) {
    console.error('[getProposals] Error', e);
  }

  return proposalsArray;
}
