import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import RenderProposalsToReviewTab from '../partials/AdminPortal/ProposalsToReviewTab';
import RenderAlerts from '../partials/Alerts/Alerts';
import RenderLoadingPage from '../partials/LoadingPage';

import useQueryString from '../utils/useQueryString'; 
import * as GLOBAL_VARS from '../utils/vars';
import RenderManageCategoriesTab from '../partials/AdminPortal/ManageCategoriesTab';
import RenderSetVotingPeriodTab from '../partials/AdminPortal/SetVotingPeriodTab';
import RenderRemoveProfilesTab from '../partials/AdminPortal/RemoveProfilesTab';
import RenderTransferAdminRoleTab from '../partials/AdminPortal/TransferAdminRoleTab';


export default function RenderAdminPortal(props){
    const [tabString, setTabString] = useQueryString(GLOBAL_VARS.TAB_QUERY_STRING_KEY, GLOBAL_VARS.PROPOSALS_TO_REVIEW_TAB_KEY);
    
    const [alertList, setAlertList] = useState([]);

    const navigate = useNavigate();

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
    if(props.queryingAdmin){
        return (<RenderLoadingPage/>);
    }

    if(!props.isAdmin){
        navigate(-1, {replace: true});
    }

    return (
        <div>
            <RenderAlerts
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <Tabs defaultActiveKey={tabString} id="admin-portal">
                <Tab 
                    eventKey={GLOBAL_VARS.PROPOSALS_TO_REVIEW_TAB_KEY} 
                    title="Proposals to review" 
                    onEnter={()=>setTabString(GLOBAL_VARS.PROPOSALS_TO_REVIEW_TAB_KEY)}
                >
                    <RenderProposalsToReviewTab
                        activeUser={props.activeUser}
                        categories={props.categories}
                    />                    
                </Tab>
                <Tab 
                    eventKey={GLOBAL_VARS.CATEGORIES_TAB_KEY} 
                    title="Manage categories" 
                    onEnter={()=>setTabString(GLOBAL_VARS.CATEGORIES_TAB_KEY)}
                >
                    <RenderManageCategoriesTab
                        activeUser={props.activeUser}
                        categories={props.categories}
                        deprecatedCategories={props.deprecatedCategories}
                        queryingCategories={props.queryingConfigs}
                        showAlert={showAlert}
                        rerunCategoriesQuery={props.rerunConfigQuery}
                    />
                </Tab>
                <Tab 
                    eventKey={GLOBAL_VARS.SET_VOTING_TAB_KEY} 
                    title="Set voting period" 
                    onEnter={()=>setTabString(GLOBAL_VARS.SET_VOTING_TAB_KEY)}
                >
                    <RenderSetVotingPeriodTab
                        activeUser={props.activeUser}
                        votingDuration={props.votingDuration}
                        queryingVotingPeriod={props.queryingConfigs}
                        showAlert={showAlert}
                        rerunVotingPeriodQuery={props.rerunConfigQuery}
                    />

                </Tab>
                <Tab 
                    eventKey={GLOBAL_VARS.REMOVE_PROFILE_TAB_KEY} 
                    title="Remove profiles" 
                    onEnter={()=>setTabString(GLOBAL_VARS.REMOVE_PROFILE_TAB_KEY)}
                >
                    <RenderRemoveProfilesTab
                        activeUser={props.activeUser}
                        showAlert={showAlert}
                    />
                </Tab>
                <Tab 
                    eventKey={GLOBAL_VARS.TRANSFER_ADMIN_ROLE_TAB_KEY} 
                    title="Transfer admin role" 
                    onEnter={()=>setTabString(GLOBAL_VARS.TRANSFER_ADMIN_ROLE_TAB_KEY)}
                >
                    <RenderTransferAdminRoleTab
                        activeUser={props.activeUser}
                        showAlert={showAlert}
                        rerunAdminQuery={props.rerunAdminQuery}
                    />
                </Tab>
                
            </Tabs>
        </div>
    );
}