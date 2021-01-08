import React, { useState } from 'react';
import RenderProfileInputContainer from './ProfileInputContainer';

import * as GLOBAL_VARS from '../../../utils/vars';
import * as ALERT_GLOBALS from '../../../utils/alerts';

export default function RenderEditProfile(props) {

    const [editableProfile, setEditableProfile] = useState(null);

    function updateEditableProfile(editableProfile){
        setEditableProfile(editableProfile);
    }

    async function editProfile(){
        let actionList = [createEditProfileAction()];
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
            props.showAlert(ALERT_GLOBALS.EDIT_PROFILE_ALERT_DICT.SUCCESS);
            props.rerunProfileQuery();
        } catch (e){
            console.log(e);
            let alertObj = {
                ...ALERT_GLOBALS.EDIT_PROFILE_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }   


    }

    function createEditProfileAction(){
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.EDIT_PROFILE_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                ...editableProfile
            }
        }
    }

    return (
        <div>
            <RenderProfileInputContainer
                profile={props.profile}
                updateEditableProfile={updateEditableProfile}
                editMode={true}
            />
            <button className="btn" onClick={()=>{editProfile()}}>Update profile</button>
        </div>
    )


}