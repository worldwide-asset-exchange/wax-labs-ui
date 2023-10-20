import { configData } from '@/api/chain/config/query/configData.ts';
import { savingsData } from '@/api/chain/config/query/savingsData.ts';
import { WAXCurrency } from '@/api/models/common.ts';
import { Config } from '@/api/models/config.ts';
import { currencyToFloat } from '@/utils/parser.ts';

export interface FormattedConfigData extends Config {
  additional_funds?: WAXCurrency | null;
  parsed_additional_funds?: number | null;
  parsed_available_funds?: number | null;
  parsed_min_requested?: number | null;
  parsed_max_requested?: number | null;
}

export async function formattedConfigData(): Promise<FormattedConfigData | null> {
  try {
    const [configDataResponse, balanceResponse] = await Promise.all([configData(), savingsData()]);

    let configDataFormatted = {} as FormattedConfigData;

    if (configDataResponse) {
      const availableFunds = currencyToFloat(configDataResponse.available_funds);

      const catDeprecated = configDataResponse?.cat_deprecated ?? [];

      configDataFormatted = {
        ...configDataResponse,
        parsed_available_funds: availableFunds,
        categories: configDataResponse?.categories.filter(category => !catDeprecated.includes(category)),
      };
    }

    if (balanceResponse) {
      configDataFormatted = {
        ...configDataFormatted,
        additional_funds: balanceResponse.balance as WAXCurrency,
        parsed_additional_funds: currencyToFloat(balanceResponse.balance),
        parsed_max_requested: currencyToFloat(configDataFormatted.max_requested),
        parsed_min_requested: currencyToFloat(configDataFormatted.min_requested),
      };
    }

    return configDataFormatted;
  } catch (e) {
    console.error('[configData] Error', e);
  }

  return null;
}
