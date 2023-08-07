import { UInt64, UInt128 } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
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
  type Bound = UInt64 | UInt128;

  const data = {
    code: LABS_CONTRACT_ACCOUNT,
    scope: LABS_CONTRACT_ACCOUNT,
    table: Tables.PROPOSALS,
    json: true,
    ...(queryType != null ? { key_type: KEY_TYPE[queryType] } : {}),
    ...(queryType != null ? { index_position: INDEX_POSITION[queryType] } : {}),
    ...(lowerBound != null ? { lower_bound: lowerBound as unknown as Bound } : {}),
    ...(upperBound != null ? { upper_bound: upperBound as unknown as Bound } : {}),
    limit: 1000,
  };

  const { rows, next_key, more } = (await waxClient.v1.chain.get_table_rows<Bound>(data)) as GetTableRowsResult<
    Proposal,
    UInt64 | UInt128
  >;

  return {
    more,
    proposals: rows,
    next_key: next_key ? next_key.toString() : null,
  };
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
