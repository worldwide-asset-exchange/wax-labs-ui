
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
    return (formattedUSDPrice / (intendedDelphiMedian / 10000)).toFixed(8);
}
