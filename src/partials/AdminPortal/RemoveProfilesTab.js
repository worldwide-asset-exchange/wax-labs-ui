import React, {useState} from 'react';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';

import './RemoveProfilesTab.scss';

export default function RenderRemoveProfilesTab (props) {
    const [waxAccount, setWaxAccount] = useState("");

    function createRemoveProfileAction() {
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.REMOVE_PROFILE_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                wax_account: waxAccount,
            }
        }
    }
    async function removeProfile(){
        let activeUser = props.activeUser;
        let actionList = [createRemoveProfileAction()];

        try {
            await activeUser.signTransaction (
                {actions: actionList}
                , {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            props.showAlert(GLOBAL_ALERTS.REMOVE_PROFILE_ADMIN_ALERT_DICT.SUCCESS);
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.REMOVE_PROFILE_ADMIN_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }
    }

    return (
        <div className="removeProfiles">
            <label className="input__label">WAX account</label>
            <input
                value={waxAccount}
                onChange={(e)=>{setWaxAccount(e.target.value)}}
                className="input"
            />
            <button className="button button--primary" onClick={()=>removeProfile()}>Remove profile</button>
        </div>
    )
}