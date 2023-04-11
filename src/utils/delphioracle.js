import * as waxjs from '@waxio/waxjs/dist';

const DELPHIORACLE_CONTRACT_ACCOUNT = 'delphioracle';
const DELPHIORACLE_WAXPUSD_PAIR = 'waxpusd';
const DELPHIORACLE_DATAPOINTS_TABLE = 'datapoints';
const DELPHIORACLE_KEY_TYPE = 'i64';

export async function fetchWAXUSDMedianPrice(wax) {
    const resp = await wax.rpc.get_table_rows({
        limit: 1,
        code: DELPHIORACLE_CONTRACT_ACCOUNT,
        scope: DELPHIORACLE_WAXPUSD_PAIR,
        table: DELPHIORACLE_DATAPOINTS_TABLE,
        json: true,
        index_position: 3,
        key_type: DELPHIORACLE_KEY_TYPE,
        reverse: true
    });
    if (resp.rows) {
        return resp.rows[0].median;
    }
}

export function calculateWAXPrice(formattedUSDPrice, intendedDelphiMedian) {
    if (intendedDelphiMedian) {
        return (formattedUSDPrice / (intendedDelphiMedian / 10000)).toFixed(2);
    } else {
        return 0;
    }
}

export function calculateUSDPrice(formattedWAXPrice, intendedDelphiMedian) {
    return (formattedWAXPrice * (intendedDelphiMedian / 10000)).toFixed(2);
}

export async function getWaxUsdPrice(updateWaxUsdPrice = () => {}) {
    const wax = new waxjs.WaxJS({
        rpcEndpoint: process.env.REACT_APP_WAX_RPC,
        tryAutoLogin: false
    });
    try {
        let intendedDelphiMedian = await fetchWAXUSDMedianPrice(wax);
        updateWaxUsdPrice(intendedDelphiMedian);
    } catch (e) {
        console.error(e);
    }
}
