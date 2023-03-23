import { useState, useEffect } from 'react';
import { Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import * as GLOBAL_VARS from '../../utils/vars';
import RenderNotifications from './Notifications';
import {
    getProposerEndVotingNotifications,
    getStartVotingNotifications,
    getProposerDeliverableNotifications,
    getReviewerDeliverableNotifications,
    getAdminEndVotingNotifications,
    getAdminToReviewNotifications
} from './NotificationQueries';

import labsIcon from '../../images/Header/WAXlabs-logo.svg';
import ProposalIcon from '../../icons/ProposalIcon';
import PortalIcon from '../../icons/PortalIcon';
import AdminIcon from '../../icons/AdminIcon';

export default function RenderLoggedInHeader(props) {
    const [notifications, setNotifications] = useState([]);
    const [querying, setQuerying] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setQuerying(true);
        async function getNotifications() {
            let promiseList = [
                getProposerEndVotingNotifications(props.activeUser.accountName),
                getStartVotingNotifications(props.activeUser.accountName),
                getProposerDeliverableNotifications(props.activeUser.accountName),
                getReviewerDeliverableNotifications(props.activeUser.accountName)
            ];
            if (props.isAdmin) {
                promiseList = [
                    ...promiseList,
                    getAdminEndVotingNotifications(),
                    getAdminToReviewNotifications()
                ];
            }
            Promise.all(promiseList).then((values) => {
                let notifications = [];
                values.forEach((list) => {
                    notifications = [...notifications, ...list];
                });
                // if dependency arrays changes cause useEffect to run again, we don't update state.
                if (!cancelled) {
                    setNotifications(notifications);
                    setQuerying(false);
                }
            });
        }
        // Needed because if querying admin hasn't happened yet, we might get wrong notification list...
        // Causing some weird interface behaviour (loading, x notifications => loading, y notifications)
        if (!props.queryingAdmin && !props.queryingCategories) {
            getNotifications();
        }
        const cleanup = () => {
            cancelled = true;
        };
        return cleanup;
    }, [props.activeUser, props.isAdmin, props.queryingAdmin, props.queryingCategories]);

    return (
        <Navbar
            collapseOnSelect
            expand="xl"
            className="header"
        >
            <Navbar.Brand
                className="header__icon"
                href="/"
            >
                <img
                    src={labsIcon}
                    alt="WAX labs icon"
                />
            </Navbar.Brand>
            <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="header__toggleButton"
            />
            <Navbar.Collapse
                id="responsive-navbar-nav"
                className="header__collapse"
            >
                <NavLink
                    to={GLOBAL_VARS.PROPOSALS_HEADER_LINK}
                    className="header__link"
                    activeClassName="header__link--active"
                >
                    <ProposalIcon />
                    Proposals
                </NavLink>
                <NavLink
                    to={GLOBAL_VARS.ACCOUNT_PORTAL_LINK}
                    className="header__link"
                    activeClassName="header__link--active"
                >
                    <PortalIcon />
                    Portal
                </NavLink>
                {props.isAdmin && (
                    <NavLink
                        to={GLOBAL_VARS.ADMIN_PORTAL_LINK}
                        className="header__link"
                        activeClassName="header__link--active"
                    >
                        <AdminIcon />
                        Admin
                    </NavLink>
                )}
                <RenderNotifications
                    notifications={notifications}
                    querying={querying}
                />
                <div className="header__account">
                    <div className="header__accountName">{props.activeUser.accountName}</div>
                    <button
                        className="button button--text header__signOut"
                        onClick={props.logout}
                    >
                        Logout
                    </button>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}
