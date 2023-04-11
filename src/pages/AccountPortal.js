import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

import { Tab, Nav } from 'react-bootstrap';

import useQueryString from '../utils/useQueryString';
import * as GLOBAL_VARS from '../utils/vars';

import RenderBalanceTab from '../partials/AccountPortal/BalanceTab';
import RenderProfileTab from '../partials/AccountPortal/ProfileTab';
import RenderAlerts from '../partials/Alerts/Alerts';
import RenderUserProposalsTab from '../partials/AccountPortal/UserProposalsTab';
import RenderDeliverablesToReviewTab from '../partials/AccountPortal/DeliverablesToReviewTab';
import { getProfileData } from '../partials/Profile/CRUD/QueryProfile';

import { sleep } from '../utils/util';
import RenderLoadingPage from '../partials/LoadingPage';

import { ReactComponent as BalanceIcon } from '../icons/BalanceIcon.svg';
import { ReactComponent as ProfileIcon } from '../icons/ProfileIcon.svg';
import { ReactComponent as MyProposalsIcon } from '../icons/MyProposalsIcon.svg';
import { ReactComponent as DeliverablesToReviewIcon } from '../icons/DeliverablesToReviewIcon.svg';

import './Portal.scss';

export default function Renderportal(props) {
    const [tabString, setTabString] = useQueryString(
        GLOBAL_VARS.TAB_QUERY_STRING_KEY,
        GLOBAL_VARS.DEFAULT_TAB_KEY
    );
    const [modeString, setModeString] = useQueryString(
        GLOBAL_VARS.MODE_QUERY_STRING_KEY,
        GLOBAL_VARS.DEFAULT_EVENT_KEY
    );

    const [accountName, setAccountName] = useState(null);

    let [searchParams] = useSearchParams();

    let location = useLocation();

    const [userProfile, setUserProfile] = useState(null);
    const [queryingUserProfile, setQueryingUserProfile] = useState(true);

    const [queryCount, setQueryCount] = useState(0);

    const [alertList, setAlertList] = useState([]);

    function updateModeString(string) {
        setModeString(string);
    }

    useEffect(() => {
        let newTabString =
            searchParams.get(GLOBAL_VARS.TAB_QUERY_STRING_KEY) || GLOBAL_VARS.DEFAULT_TAB_KEY;
        let newModeString =
            searchParams.get(GLOBAL_VARS.MODE_QUERY_STRING_KEY) || GLOBAL_VARS.DEFAULT_EVENT_KEY;

        setTabString({ value: newTabString, skipUpdateQS: true });
        setModeString({ value: newModeString, skipUpdateQS: true });

        //eslint-disable-next-line
    }, [location]);

    useEffect(() => {
        let cancelled = false;

        if (accountName) {
            setQueryingUserProfile(true);
            getProfileData(accountName).then((profileData) => {
                if (!cancelled) {
                    setUserProfile(profileData);
                    setQueryingUserProfile(false);
                }
            });
        }

        const cleanup = () => {
            cancelled = true;
        };
        return cleanup;
    }, [accountName, queryCount]);

    function showAlert(alertObj) {
        // Make a copy.
        let alerts = alertList.slice(0);
        // Push new alert to the copied list
        alerts.push(alertObj);
        // Update the list.
        setAlertList(alerts);
    }

    function removeAlert(index) {
        // Make a copy.
        let alerts = alertList.slice(0);
        // remove alert at index.
        alerts.splice(index, 1);
        // Update the list.
        setAlertList(alerts);
    }

    useEffect(() => {
        if (props.activeUser) {
            setAccountName(props.activeUser.accountName);
        }
    }, [props.activeUser]);

    async function rerunProfileQuery() {
        setQueryingUserProfile(true);
        setModeString(GLOBAL_VARS.DISPLAY_EVENT_KEY);
        await sleep(3500);
        setQueryCount(queryCount + 1);
    }

    if (!props.activeUser) {
        return <RenderLoadingPage />;
    }

    return (
        <div className="portal">
            <RenderAlerts
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <Tab.Container
                activeKey={tabString}
                id="account-portal"
                onSelect={(key) => setTabString(key)}
            >
                <Nav className="portal__tabs">
                    <Nav.Link
                        eventKey={GLOBAL_VARS.BALANCE_TAB_KEY}
                        className="portal__tab"
                    >
                        <BalanceIcon />
                        <span className="portal__tabTitle">Balance</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey={GLOBAL_VARS.PROFILE_TAB_KEY}
                        className="portal__tab"
                    >
                        <ProfileIcon />
                        <span className="portal__tabTitle">Profile</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey={GLOBAL_VARS.MY_PROPOSALS_TAB_KEY}
                        className="portal__tab"
                    >
                        <MyProposalsIcon />
                        <span className="portal__tabTitle">My proposals</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey={GLOBAL_VARS.DELIVERABLES_TO_REVIEW_TAB_KEY}
                        className="portal__tab"
                    >
                        <DeliverablesToReviewIcon />
                        <span className="portal__tabTitle">Deliverables to review</span>
                    </Nav.Link>
                </Nav>
                <Tab.Content className="portal__content">
                    <Tab.Pane eventKey={GLOBAL_VARS.BALANCE_TAB_KEY}>
                        <RenderBalanceTab
                            activeUser={props.activeUser}
                            showAlert={showAlert}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey={GLOBAL_VARS.PROFILE_TAB_KEY}>
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
                    </Tab.Pane>
                    <Tab.Pane eventKey={GLOBAL_VARS.MY_PROPOSALS_TAB_KEY}>
                        <RenderUserProposalsTab
                            userToSearch={props.activeUser.accountName}
                            showAlert={showAlert}
                            subtitle="Your proposals"
                            categories={props.categories}
                            activeUser={props.activeUser}
                            showCreateButton
                            profile={userProfile}
                            defaultStatus={[]}
                            tabString={tabString}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey={GLOBAL_VARS.DELIVERABLES_TO_REVIEW_TAB_KEY}>
                        <RenderDeliverablesToReviewTab
                            reviewer={props.activeUser.accountName}
                            showAlert={showAlert}
                            categories={props.categories}
                            activeUser={props.activeUser}
                            profile={userProfile}
                            tabString={tabString}
                        />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
}
