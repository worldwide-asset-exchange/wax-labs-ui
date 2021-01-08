import React, {useState, useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import useQueryString from '../../utils/useQueryString';

import * as GLOBAL_VARS from '../../utils/vars';
import {getProfileData} from '../Profile/QueryProfile';

import RenderProfileDisplay from '../Profile/ProfileDisplay';
import RenderLoadingPage from '../LoadingPage';

export default function RenderProfileTab(props) {
    const [userProfile, setUserProfile] = useState(null);
    const [queryingUserProfile, setQueryingUserProfile] = useState(true);
    const [counter, setCounter] = useState(0);
    const [modeString, setModeString] = useQueryString(GLOBAL_VARS.MODE_QUERY_STRING_KEY, GLOBAL_VARS.DISPLAY_EVENT_KEY);


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
    }, [props.nameToQuery]);


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
                    ?   <button 
                            className="btn"
                            onClick={()=>{setModeString(GLOBAL_VARS.EDIT_EVENT_KEY)}
                        }>
                            Edit profile
                        </button>
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
                <button 
                    className="btn"
                    onClick={()=>{setModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY)}
                }>
                    View profile
                </button>
            </div>
        )
    }
    return (
        null
    );
}