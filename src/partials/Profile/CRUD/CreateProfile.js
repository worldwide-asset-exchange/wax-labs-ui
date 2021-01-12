import React, { useState } from 'react';
import RenderProfileInputContainer from './ProfileInputContainer';

import * as GLOBAL_VARS from '../../../utils/vars';
import * as ALERT_GLOBALS from '../../../utils/alerts';

import './CreateProfile.scss';

export default function RenderCreateProfile(props) {
    const [editableProfile, setEditableProfile] = useState(null);

    const [dataValid, setDataValid] = useState(false);
    const [showValidatorMessages, setShowValidatorMessages] = useState(false);

    function updateEditableProfile(editableProfile){
        setEditableProfile(editableProfile);
    }

    function updateValidatorData(allValid){
        setDataValid(allValid);
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

        if(!dataValid){
            props.showAlert(ALERT_GLOBALS.INVALID_DATA_ALERT_DICT.WARN);
            setShowValidatorMessages(true);
            return;
        }

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
        <div className="createProfile">
            <RenderProfileInputContainer
                updateValidatorData={updateValidatorData}
                updateEditableProfile={updateEditableProfile}
                showValidatorMessages={showValidatorMessages}
            />
            <div className="createProfile__actions">
                <button
                    className="button button--secondary"
                    onClick={()=>{props.updateModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY)}
                }>
                    View profile
                </button>
                <button className="button button--primary" onClick={()=>createProfile()}>Create profile</button>
            </div>
        </div>
    )
}