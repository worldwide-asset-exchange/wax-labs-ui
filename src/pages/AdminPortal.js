import React, { useState, useEffect } from 'react';
import {useNavigate, useSearchParams, useLocation} from 'react-router-dom';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import RenderProposalsToReviewTab from '../partials/AdminPortal/ProposalsToReviewTab';
import RenderAlerts from '../partials/Alerts/Alerts';
import RenderLoadingPage from '../partials/LoadingPage';

import useQueryString from '../utils/useQueryString';
import * as GLOBAL_VARS from '../utils/vars';
import RenderManageCategoriesTab from '../partials/AdminPortal/ManageCategoriesTab';
import RenderSetVotingPeriodTab from '../partials/AdminPortal/SetVotingPeriodTab';
import RenderRemoveProfilesTab from '../partials/AdminPortal/RemoveProfilesTab';
import RenderTransferAdminRoleTab from '../partials/AdminPortal/TransferAdminRoleTab';
import RenderSetMinMaxRequestedTab from '../partials/AdminPortal/SetMinMaxRequestedTab';

import ReviewProposalIcon from '../icons/ReviewProposalIcon';
import CategoriesIcon from '../icons/CategoriesIcon';
import VotingPeriodIcon from '../icons/VotingPeriodIcon';
import RemoveProfileIcon from '../icons/RemoveProfileIcon';
import TransferRoleIcon from '../icons/TransferRoleIcon';
import BalanceIcon from '../icons/BalanceIcon';

import './Portal.scss'

export default function RenderAdminPortal(props){
    const [tabString, setTabString] = useQueryString(GLOBAL_VARS.TAB_QUERY_STRING_KEY, GLOBAL_VARS.DEFAULT_ADMIN_TAB_KEY);
    let [searchParams, ] = useSearchParams();
    let location = useLocation();

    const [alertList, setAlertList] = useState([]);
    const [showValidatorMessages, setShowValidatorMessages] = useState(0);


    const navigate = useNavigate();

    useEffect(()=>{

        let newTabString = searchParams.get(GLOBAL_VARS.TAB_QUERY_STRING_KEY) || GLOBAL_VARS.DEFAULT_ADMIN_TAB_KEY;

        setTabString({value: newTabString, skipUpdateQS: true});

        //eslint-disable-next-line
    }, [location])

    
        
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
        <div className="portal">
            <RenderAlerts
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <Tab.Container activeKey={tabString} id="admin-portal" onSelect={(k)=>setTabString(k)}>
                <Nav className="portal__tabs">
                    <Nav.Link
                        eventKey={GLOBAL_VARS.PROPOSALS_TO_REVIEW_TAB_KEY}
                        className="portal__tab"
                        activeClassName="portal__tab--active"
                    >
                        <ReviewProposalIcon/>
                        <span className="portal__tabTitle">Proposals to review</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey={GLOBAL_VARS.CATEGORIES_TAB_KEY}
                        className="portal__tab"
                        activeClassName="portal__tab--active"
                    >
                        <CategoriesIcon/>
                        <span className="portal__tabTitle">Manage categories</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey={GLOBAL_VARS.SET_VOTING_TAB_KEY}
                        className="portal__tab"
                        activeClassName="portal__tab--active"
                    >
                        <VotingPeriodIcon/>
                        <span className="portal__tabTitle">Set voting period</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey={GLOBAL_VARS.REMOVE_PROFILE_TAB_KEY}
                        className="portal__tab"
                        activeClassName="portal__tab--active"
                    >
                        <RemoveProfileIcon/>
                        <span className="portal__tabTitle">Remove profile</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey={GLOBAL_VARS.TRANSFER_ADMIN_ROLE_TAB_KEY}
                        className="portal__tab"
                        activeClassName="portal__tab--active"
                    >
                        <TransferRoleIcon/>
                        <span className="portal__tabTitle">Transfer admin role</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey={GLOBAL_VARS.SET_MIN_MAX_REQUESTED_TAB_KEY}
                        className="portal__tab"
                        activeClassName="portal__tab--active"
                    >
                        <BalanceIcon/>
                        <span className="portal__tabTitle">Set min/max USD requested</span>
                    </Nav.Link>
                </Nav>
                <Tab.Content className="portal__content">
                    <Tab.Pane eventKey={GLOBAL_VARS.PROPOSALS_TO_REVIEW_TAB_KEY}>
                        <RenderProposalsToReviewTab
                                activeUser={props.activeUser}
                                categories={props.categories}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey={GLOBAL_VARS.CATEGORIES_TAB_KEY}>
                        <RenderManageCategoriesTab
                                activeUser={props.activeUser}
                                categories={props.categories}
                                deprecatedCategories={props.deprecatedCategories}
                                queryingCategories={props.queryingConfigs}
                                showAlert={showAlert}
                                rerunCategoriesQuery={props.rerunConfigQuery}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey={GLOBAL_VARS.SET_VOTING_TAB_KEY}>
                        <RenderSetVotingPeriodTab
                            activeUser={props.activeUser}
                            votingDuration={props.votingDuration}
                            queryingVotingPeriod={props.queryingConfigs}
                            showAlert={showAlert}
                            rerunVotingPeriodQuery={props.rerunConfigQuery}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey={GLOBAL_VARS.REMOVE_PROFILE_TAB_KEY}>
                        <RenderRemoveProfilesTab
                            activeUser={props.activeUser}
                            showAlert={showAlert}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey={GLOBAL_VARS.TRANSFER_ADMIN_ROLE_TAB_KEY}>
                        <RenderTransferAdminRoleTab
                            activeUser={props.activeUser}
                            showAlert={showAlert}
                            rerunAdminQuery={props.rerunAdminQuery}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey={GLOBAL_VARS.SET_MIN_MAX_REQUESTED_TAB_KEY}>
                        <RenderSetMinMaxRequestedTab
                            activeUser={props.activeUser}
                            minRequested={props.minRequested}
                            maxRequested={props.maxRequested}
                            queryingMinMaxRequested={props.queryingConfigs}
                            showAlert={showAlert}
                            showValidatorMessages={showValidatorMessages}
                            setShowValidatorMessages={setShowValidatorMessages}
                            rerunSetMinMaxRequestedQuery={props.rerunConfigQuery}
                            loadWaxUsdPrice={props.loadWaxUsdPrice}
                            waxUsdPrice={props.waxUsdPrice}
                        />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
}