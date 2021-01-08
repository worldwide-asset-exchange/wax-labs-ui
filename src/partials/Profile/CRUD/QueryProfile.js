
import * as waxjs from "@waxio/waxjs/dist";

import * as GLOBAL_VARS from '../../../utils/vars';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);



export async function getProfileData(nameToQuery){

    try {
        let resp = await wax.rpc.get_table_rows({
            code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            table: GLOBAL_VARS.PROFILES_TABLE,
            json: true,
            lower_bound: nameToQuery,
            upper_bound: nameToQuery,
            limit: 1
        });
        let profileData = resp.rows[0];
        return profileData;
            
    } catch (e) {
        console.log(e);
        return null;
    }
    

}