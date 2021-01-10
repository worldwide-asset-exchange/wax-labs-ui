import React, {useState} from 'react';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';

export default function RenderTransferAdminRoleTab (props) {
    const [waxAccount, setWaxAccount] = useState("");

    function createSetAdminAction() {
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.SET_ADMIN_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                new_admin: waxAccount,
            }
        }
    }
    async function setAdmin(){
        let activeUser = props.activeUser;
        let actionList = [createSetAdminAction()];

        try {
            await activeUser.signTransaction (
                {actions: actionList}
                , {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            props.showAlert(GLOBAL_ALERTS.SET_ADMIN_ALERT_DICT.SUCCESS);
            props.rerunAdminQuery();
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.SET_ADMIN_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }
    }

    return (
        <div>
            <label>WAX account</label>
            <input value={waxAccount} onChange={(e)=>{setWaxAccount(e.target.value)}}/>
            <button className="btn" onClick={()=>setAdmin()}>Transfer admin role</button>
        </div>
    )
}