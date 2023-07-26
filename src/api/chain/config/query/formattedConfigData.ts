import { configData } from '@/api/chain/config/query/configData.ts';
import { savingsData } from '@/api/chain/config/query/savingsData.ts';
import { WAXCurrency } from '@/api/models/common.ts';
import { Config } from '@/api/models/config.ts';
import { currencyToFloat } from '@/utils/parser.ts';

export interface FormattedConfigData extends Config {
  additional_funds?: WAXCurrency | null;
  parsed_additional_funds?: number | null;
  parsed_available_funds?: number | null;
}

export async function formattedConfigData(): Promise<FormattedConfigData | null> {
  try {
    const [configDataResponse, balanceResponse] = await Promise.all([configData(), savingsData()]);

    let configDataFormatted = {} as FormattedConfigData;

    if (configDataResponse) {
      const availableFunds = currencyToFloat(configDataResponse.available_funds);

      configDataFormatted = {
        ...configDataResponse,
        parsed_available_funds: availableFunds,
      };
    }

    if (balanceResponse) {
      configDataFormatted = {
        ...configDataFormatted,
        additional_funds: balanceResponse.balance,
        parsed_additional_funds: currencyToFloat(balanceResponse.balance),
      };
    }

    return configDataFormatted;
  } catch (e) {
    console.error('[configData] Error', e);
  }

  return null;
}
