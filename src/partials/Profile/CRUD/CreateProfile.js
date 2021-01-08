import React, { useState } from 'react';
import RenderProfileInputContainer from './ProfileInputContainer';

import * as GLOBAL_VARS from '../../../utils/vars';
import * as ALERT_GLOBALS from '../../../utils/alerts';

export default function RenderCreateProfile(props) {
    const [editableProfile, setEditableProfile] = useState(null);

    function updateEditableProfile(editableProfile){
        setEditableProfile(editableProfile);
    }

    function createNewProfileAction () {
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.NEW_PROFILE_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                ...editableProfile
            }
        }
    }
    async function createProfile () {
        let actionList = [createNewProfileAction()];
        let activeUser = props.activeUser;

        
        try {
            await activeUser.signTransaction(
                {
                    actions: actionList
                } , {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            props.showAlert(ALERT_GLOBALS.CREATE_PROFILE_ALERT_DICT.SUCCESS);
            props.rerunProfileQuery();
        } catch (e){
            console.log(e);
            let alertObj = {
                ...ALERT_GLOBALS.CREATE_PROFILE_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }   
    }

    return (
        <div>
            <RenderProfileInputContainer 
                updateEditableProfile={updateEditableProfile}
            />
            <button className="btn" onClick={()=>createProfile()}>Create profile</button>
        </div>
    )
}