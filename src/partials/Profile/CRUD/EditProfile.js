import { useState } from 'react';
import RenderProfileInputContainer from './ProfileInputContainer';

import * as GLOBAL_VARS from '../../../utils/vars';
import * as ALERT_GLOBALS from '../../../utils/alerts';

import './EditProfile.scss';

export default function RenderEditProfile(props) {
    const [editableProfile, setEditableProfile] = useState(null);

    const [dataValid, setDataValid] = useState(false);
    const [showValidatorMessages, setShowValidatorMessages] = useState(false);

    function updateEditableProfile(editableProfile) {
        setEditableProfile(editableProfile);
    }

    function updateValidatorData(allValid) {
        setDataValid(allValid);
    }

    async function editProfile() {
        let actionList = [createEditProfileAction()];
        let activeUser = props.activeUser;

        if (!dataValid) {
            props.showAlert(ALERT_GLOBALS.INVALID_DATA_ALERT_DICT.WARN);
            setShowValidatorMessages(true);
            return;
        }

        try {
            await activeUser.signTransaction(
                {
                    actions: actionList
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            props.showAlert(ALERT_GLOBALS.EDIT_PROFILE_ALERT_DICT.SUCCESS);
            props.rerunProfileQuery();
        } catch (e) {
            console.debug(e);
            let alertObj = {
                ...ALERT_GLOBALS.EDIT_PROFILE_ALERT_DICT.ERROR,
                details: e.message
            };
            props.showAlert(alertObj);
        }
    }

    function createEditProfileAction() {
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.EDIT_PROFILE_ACTION,
            authorization: [
                {
                    actor: activeUser.accountName,
                    permission: activeUser.requestPermission
                }
            ],
            data: {
                ...editableProfile
            }
        };
    }

    return (
        <div className="editProfile">
            <RenderProfileInputContainer
                showValidatorMessages={showValidatorMessages}
                updateValidatorData={updateValidatorData}
                profile={props.profile}
                updateEditableProfile={updateEditableProfile}
                editMode
            />
            <div className="editProfile__actions">
                <button
                    className="button button--text"
                    onClick={() => props.updateModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY)}
                >
                    View profile
                </button>
                <button
                    className="button button--text"
                    onClick={props.removeProfile}
                >
                    Remove profile
                </button>
                <button
                    className="button button--primary"
                    onClick={editProfile}
                >
                    Update profile
                </button>
            </div>
        </div>
    );
}
