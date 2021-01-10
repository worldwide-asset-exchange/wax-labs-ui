import React, { useEffect, useState } from 'react';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import useQueryString from '../utils/useQueryString'; 
import * as GLOBAL_VARS from '../utils/vars';

import RenderBalanceTab from '../partials/AccountPortal/BalanceTab';
import RenderProfileTab from '../partials/AccountPortal/ProfileTab';
import RenderAlerts from '../partials/Alerts/Alerts';
import RenderMyProposalsTab from '../partials/AccountPortal/UserProposalsTab';
import RenderDeliverablesToReviewTab from '../partials/AccountPortal/DeliverablesToReviewTab';
import {getProfileData} from '../partials/Profile/CRUD/QueryProfile';


import { sleep } from '../utils/util';

export default function RenderAccountPortal (props) {

    const [tabString, setTabString] = useQueryString(GLOBAL_VARS.TAB_QUERY_STRING_KEY, GLOBAL_VARS.BALANCE_EVENT_KEY);
    const [modeString, setModeString] = useQueryString(GLOBAL_VARS.MODE_QUERY_STRING_KEY, GLOBAL_VARS.DISPLAY_EVENT_KEY);
    
    const [accountName, setAccountName] = useState(null);
      

    const [userProfile, setUserProfile] = useState(null);
    const [queryingUserProfile, setQueryingUserProfile] = useState(true);
    
    const [queryCount, setQueryCount] = useState(0);

    const [alertList, setAlertList] = useState([]);

    function updateModeString (string) {
        setModeString(string);
    }

    useEffect(()=>{
        
        let cancelled = false;
        
        if(accountName){
            setQueryingUserProfile(true);
            getProfileData(accountName).then(profileData => {
                console.log(profileData);
                if(!cancelled){
                    setUserProfile(profileData);
                    setQueryingUserProfile(false);
                }
            })
        }
        
        const cleanup = () => {cancelled = true};
        return cleanup;
    }, [accountName, queryCount]);

    function showAlert(alertObj){
        // Make a copy.
        let alerts = alertList.slice(0);
        // Push new alert to the copied list
        alerts.push(alertObj);
        // Update the list.
        setAlertList(alerts);
    }

    function removeAlert(index){
        // Make a copy.
        let alerts = alertList.slice(0);
        // remove alert at index.
        alerts.splice(index,1);
        // Update the list.
        setAlertList(alerts);
    }

    useEffect(()=>{
        if(props.activeUser){
            setAccountName(props.activeUser.accountName);
        }
    }, [props.activeUser]);

    async function rerunProfileQuery(){
        setQueryingUserProfile(true);
        setModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY);
        await sleep(3500);
        setQueryCount(queryCount + 1);
    }

    return (
        <div>
            <RenderAlerts
                alertList={alertList}
                removeAlert={removeAlert}
            />

            <Tabs defaultActiveKey={tabString} id="account-portal">
                <Tab 
                    eventKey={GLOBAL_VARS.BALANCE_EVENT_KEY} 
                    title="Balance" 
                    onEnter={()=>setTabString(GLOBAL_VARS.BALANCE_EVENT_KEY)}
                >
                    <RenderBalanceTab activeUser={props.activeUser} showAlert={showAlert} />
                </Tab>
                <Tab 
                    eventKey={GLOBAL_VARS.PROFILE_EVENT_KEY} 
                    title="Profile"
                    onEnter={()=>setTabString(GLOBAL_VARS.PROFILE_EVENT_KEY)}
                >
                    <RenderProfileTab 
                        nameToQuery={accountName} 
                        activeUser={props.activeUser} 
                        showAlert={showAlert}
                        userProfile={userProfile}
                        queryingUserProfile={queryingUserProfile}
                        rerunProfileQuery={rerunProfileQuery}
                        updateModeString={updateModeString}
                        modeString={modeString}
                    />
                </Tab>
                <Tab 
                    eventKey={GLOBAL_VARS.MY_PROPOSALS_EVENT_KEY} 
                    title="My proposals"
                    onEnter={()=>setTabString(GLOBAL_VARS.MY_PROPOSALS_EVENT_KEY)}
                >
                    <RenderMyProposalsTab
                        userToSearch={props.activeUser ? props.activeUser.accountName : "null"}
                        showAlert={showAlert}
                        categories={props.categories}
                        activeUser={props.activeUser}
                        profile={userProfile}
                        defaultStatus={[]}
                        tabString={tabString}
                    />
                </Tab>
                <Tab 
                    eventKey={GLOBAL_VARS.DELIVERABLES_TO_REVIEW_EVENT_KEY} 
                    title="Deliverables to review"
                    onEnter={()=>setTabString(GLOBAL_VARS.DELIVERABLES_TO_REVIEW_EVENT_KEY)}
                >
                    <RenderDeliverablesToReviewTab
                        reviewer={props.activeUser ? props.activeUser.accountName : "null"}
                        showAlert={showAlert}
                        categories={props.categories}
                        activeUser={props.activeUser}
                        profile={userProfile}
                        tabString={tabString}
                    />
                </Tab>
            </Tabs>
        </div>
    )
}
