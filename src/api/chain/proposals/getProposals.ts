import wax from '@/api/chain';
import { Proposal } from '@/api/models/proposal.ts';
import {
  INDEX_POSITION,
  KEY_TYPE,
  LABS_CONTRACT_ACCOUNT,
  ProposalFilterType,
  ProposalStatusKey,
  Tables,
} from '@/constants.ts';

export interface ProposalResponse {
  proposals: Proposal[] | null;
  next_key: string | null;
  more: boolean;
}

interface ProposalsFilterRange {
  queryType: ProposalFilterType;
  lowerBound: string;
  upperBound: string;
}

export interface ProposalsFilter extends ProposalsFilterRange {
  statusKey: ProposalStatusKey;
}

async function getProposalRange({
  queryType,
  lowerBound,
  upperBound,
}: ProposalsFilterRange): Promise<ProposalResponse> {
  const { rows, next_key, more } = await wax.rpc.get_table_rows({
    code: LABS_CONTRACT_ACCOUNT,
    scope: LABS_CONTRACT_ACCOUNT,
    table: Tables.PROPOSALS,
    json: true,
    key_type: KEY_TYPE[queryType],
    index_position: INDEX_POSITION[queryType],
    lower_bound: lowerBound,
    upper_bound: upperBound,
    limit: 1000,
  });

  return { proposals: rows, next_key, more };
}

export async function getProposals({ queryType, lowerBound, upperBound }: ProposalsFilter) {
  const proposalsArray: Proposal[] = [];

  let nextKey = lowerBound;

  try {
    for (;;) {
      const { proposals, more, next_key } = await getProposalRange({ queryType, upperBound, lowerBound: nextKey });

      proposalsArray.push(...(proposals || []));

      if (!more) {
        break;
      }

      nextKey = next_key as string;
    }
  } catch (e) {
    console.error('Error while getting proposals', e);
  }

  return proposalsArray;
}
