import React, {useState, useEffect} from 'react';
import useQueryString from '../../utils/useQueryString';

import * as GLOBAL_VARS from '../../utils/vars';
import * as ALERT_GLOBALS from '../../utils/alerts';
import {getProfileData} from '../Profile/CRUD/QueryProfile';

import RenderProfileDisplay from '../Profile/ProfileDisplay';
import RenderLoadingPage from '../LoadingPage';
import RenderEditProfile from '../Profile/CRUD/EditProfile';
import RenderCreateProfile from '../Profile/CRUD/CreateProfile';

import { sleep } from '../../utils/util';

export default function RenderProfileTab(props) {
    const [userProfile, setUserProfile] = useState(null);
    const [queryingUserProfile, setQueryingUserProfile] = useState(true);
    const [modeString, setModeString] = useQueryString(GLOBAL_VARS.MODE_QUERY_STRING_KEY, GLOBAL_VARS.DISPLAY_EVENT_KEY);
    const [queryCount, setQueryCount] = useState(0);

    useEffect(()=>{
        
        let cancelled = false;

     
        if(props.nameToQuery){
            setQueryingUserProfile(true);
            getProfileData(props.nameToQuery).then(profileData => {
                console.log(profileData);
                if(!cancelled){
                    setUserProfile(profileData);
                    setQueryingUserProfile(false);
                }
            })
        }
        
        const cleanup = () => {cancelled = true};
        return cleanup;
    }, [props.nameToQuery, queryCount]);

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
            rerunProfileQuery();
        } catch (e){
            console.log(e);
            let alertObj = {
                ...ALERT_GLOBALS.REMOVE_PROFILE_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }   

    }

    async function rerunProfileQuery(){
        setQueryingUserProfile(true);
        setModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY);
        await sleep(3500);
        setQueryCount(queryCount + 1);
    }

    if(queryingUserProfile){
        return (
            <RenderLoadingPage/>
        )
    }

    if(modeString === GLOBAL_VARS.DISPLAY_EVENT_KEY){
        return (
            <div style={{color: "white"}}>
                <RenderProfileDisplay profile={userProfile} notFoundMessage="Your profile hasn't been created yet." />
                {
                    userProfile 
                    ?   
                        <div>
                            <button 
                                className="btn"
                                onClick={()=>{setModeString(GLOBAL_VARS.EDIT_EVENT_KEY)}
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
                            onClick={()=>{setModeString(GLOBAL_VARS.CREATE_EVENT_KEY)}
                        }>
                            Create profile
                        </button>
                }
            </div>
        )
    } else if (modeString === GLOBAL_VARS.CREATE_EVENT_KEY){
        return (
            <div>
                <RenderCreateProfile 
                    activeUser={props.activeUser} 
                    showAlert={props.showAlert} 
                    profileName={props.nameToQuery}
                    rerunProfileQuery={rerunProfileQuery}
                />
                <button 
                    className="btn"
                    onClick={()=>{setModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY)}
                }>
                    View profile
                </button>
            </div>
        )
    } else if (modeString === GLOBAL_VARS.EDIT_EVENT_KEY) {
        return (
            <div>
                <RenderEditProfile 
                    profile={userProfile} 
                    activeUser={props.activeUser}
                    rerunProfileQuery={rerunProfileQuery}
                    showAlert={props.showAlert}
                />
                <button 
                    className="btn"
                    onClick={()=>{setModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY)}
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