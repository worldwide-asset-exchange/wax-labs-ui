import React from 'react';

import * as GLOBAL_VARS from '../../utils/vars';
import * as ALERT_GLOBALS from '../../utils/alerts';

import RenderProfileDisplay from '../Profile/ProfileDisplay';
import RenderLoadingPage from '../LoadingPage';
import RenderEditProfile from '../Profile/CRUD/EditProfile';
import RenderCreateProfile from '../Profile/CRUD/CreateProfile';


export default function RenderProfileTab(props) {
   

    function createRemoveProfileAction () {
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.REMOVE_PROFILE_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                wax_account: activeUser.accountName
            }
        }
    }

    async function removeProfile() {
        let activeUser = props.activeUser;
        let actionList = [createRemoveProfileAction()];

        try {
            await activeUser.signTransaction(
                {
                    actions: actionList
                } , {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            props.showAlert(ALERT_GLOBALS.REMOVE_PROFILE_ALERT_DICT.SUCCESS);
            props.rerunProfileQuery();
        } catch (e){
            console.log(e);
            let alertObj = {
                ...ALERT_GLOBALS.REMOVE_PROFILE_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }   
    }
    
    if(props.queryingUserProfile){
        return (
            <RenderLoadingPage/>
        )
    }

    if(props.modeString === GLOBAL_VARS.DISPLAY_EVENT_KEY){
        return (
            <div style={{color: "white"}}>
                <RenderProfileDisplay profile={props.userProfile} notFoundMessage="Your profile hasn't been created yet." />
                {
                    props.userProfile 
                    ?   
                        <div>
                            <button 
                                className="btn"
                                onClick={()=>{props.updateModeString(GLOBAL_VARS.EDIT_EVENT_KEY)}
                            }>
                                Edit profile
                            </button>
                            <button
                                className="btn"
                                onClick={removeProfile}
                            > Remove profile</button>
                        </div>
                    :   <button 
                            className="btn"
                            onClick={()=>{props.updateModeString(GLOBAL_VARS.CREATE_EVENT_KEY)}
                        }>
                            Create profile
                        </button>
                }
            </div>
        )
    } else if (props.modeString === GLOBAL_VARS.CREATE_EVENT_KEY){
        return (
            <div>
                <RenderCreateProfile 
                    activeUser={props.activeUser} 
                    showAlert={props.showAlert} 
                    profileName={props.nameToQuery}
                    rerunProfileQuery={props.rerunProfileQuery}
                />
                <button 
                    className="btn"
                    onClick={()=>{props.updateModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY)}
                }>
                    View profile
                </button>
            </div>
        )
    } else if (props.modeString === GLOBAL_VARS.EDIT_EVENT_KEY) {
        return (
            <div>
                <RenderEditProfile 
                    profile={props.userProfile} 
                    activeUser={props.activeUser}
                    rerunProfileQuery={props.rerunProfileQuery}
                    showAlert={props.showAlert}
                />
                <button 
                    className="btn"
                    onClick={()=>{props.updateModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY)}
                }>
                    View profile
                </button>
                <button
                    className="btn"
                    onClick={removeProfile}
                > Remove profile</button>
            </div>
        )
    }
    return (
        null
    );
}