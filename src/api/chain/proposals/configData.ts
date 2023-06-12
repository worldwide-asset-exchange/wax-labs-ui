import wax from '@/api/chain';
import { getProposals } from '@/api/chain/proposals/getProposals.ts';
import { statBounds } from '@/api/chain/proposals/proposalBounds.ts';
import {
  EOSIO_TOKEN_CODE,
  LABS_CONTRACT_ACCOUNT,
  ProposalFilterType,
  ProposalStatusKey,
  SAVINGS_ACCOUNT,
  Tables,
} from '@/constants.ts';
import { numberWithCommas, requestedAmountToFloat } from '@/utils/parser.ts';

export function inProgressProposals() {
  const { upperBound, lowerBound } = statBounds(ProposalStatusKey.PROPOSAL_IN_PROGRESS);

  return getProposals({
    queryType: ProposalFilterType.BY_STAT_CAT,
    statusKey: ProposalStatusKey.PROPOSAL_IN_PROGRESS,
    lowerBound,
    upperBound,
  });
}

export async function configData() {
  let success = false;
  do {
    try {
      let configData = null;
      const { rows } = await wax.rpc.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: LABS_CONTRACT_ACCOUNT,
        table: Tables.CONFIG,
        json: true,
        limit: 1,
      });

      if (rows) {
        configData = rows[0];
        success = true;
        configData.available_funds = requestedAmountToFloat(configData.available_funds);
        configData.display_available_funds = numberWithCommas(configData.available_funds).toString() + ' WAX';
      }

      const savingsResp = await wax.rpc.get_table_rows({
        json: true,
        code: EOSIO_TOKEN_CODE,
        scope: SAVINGS_ACCOUNT,
        table: Tables.ACCOUNTS,
      });

      let additional_funds;
      if (savingsResp.rows) {
        additional_funds = savingsResp.rows[0].balance;
        configData.additional_funds = requestedAmountToFloat(additional_funds);
        configData.display_additional_funds = numberWithCommas(configData.additional_funds).toString() + ' WAX';
      }
    } catch (e) {
      console.debug(e);
      success = false;
    }
  } while (!success);
}
