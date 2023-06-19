import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { EOSIO_TOKEN_CODE, LABS_CONTRACT_ACCOUNT, SAVINGS_ACCOUNT, Tables } from '@/constants.ts';
import { formatWax } from '@/utils/formatter.ts';
import { currencyToFloat } from '@/utils/parser.ts';

interface ConfigDataBaseResponse {
  admin_acct: string;
  admin_auth: string;
  cat_deprecated: string[];
  categories: string[];
  contract_name: string;
  contract_version: string;
  deposited_funds: string;
  last_proposal_id: number;
  max_requested: string;
  min_requested: string;
  paid_funds: string;
  quorum_threshold: string;
  reserved_funds: string;
  vote_duration: number;
  yes_threshold: string;
}

interface ConfigDataResponse extends ConfigDataBaseResponse {
  available_funds: string;
}

interface SavingsAccountResponse {
  balance: string;
}

export interface ConfigData extends ConfigDataBaseResponse {
  additional_funds: number | null;
  display_additional_funds: string;

  available_funds: number | null;
  display_available_funds: string;
}

async function _getConfigData(): Promise<ConfigDataResponse> {
  const { rows } = (await wax.rpc.get_table_rows({
    code: LABS_CONTRACT_ACCOUNT,
    scope: LABS_CONTRACT_ACCOUNT,
    table: Tables.CONFIG,
    json: true,
    limit: 1,
  })) as GetTableRowsResult<ConfigDataResponse>;

  return rows[0] || {};
}

async function _getSavingsData(): Promise<SavingsAccountResponse> {
  const { rows } = (await wax.rpc.get_table_rows({
    json: true,
    code: EOSIO_TOKEN_CODE,
    scope: SAVINGS_ACCOUNT,
    table: Tables.ACCOUNTS,
  })) as GetTableRowsResult<SavingsAccountResponse>;

  return rows?.[0] ?? ({ balance: '0 WAX' } as SavingsAccountResponse);
}

export async function configData(): Promise<ConfigData> {
  let configData: ConfigData = {} as ConfigData;

  for (;;) {
    try {
      const [configDataResponse, balanceResponse] = await Promise.all([_getConfigData(), _getSavingsData()]);

      if (configDataResponse) {
        const availableFunds = currencyToFloat(configDataResponse.available_funds);

        configData = {
          ...configDataResponse,
          available_funds: availableFunds,
          display_available_funds: formatWax(availableFunds),
          additional_funds: 0,
          display_additional_funds: '',
        };
      }

      if (balanceResponse) {
        configData.additional_funds = currencyToFloat(balanceResponse.balance);
        configData.display_additional_funds = formatWax(configData.additional_funds);
      }

      break;
    } catch (e) {
      console.error('[configData] Error', e);
    }
  }

  return configData;
}
