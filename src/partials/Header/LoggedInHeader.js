import React from 'react';
import { Link } from 'react-router-dom'

import * as GLOBAL_VARS from '../../utils/vars';
import RenderNotifications from './Notifications';

export default function RenderLoggedInHeader(props){
// Leaving notifications full implementation for later, since we need indexing changes to query them efficiently.

    return (
        <div>
            <Link to={GLOBAL_VARS.PROPOSALS_LINK}>Proposals</Link>
            <RenderNotifications notifications={[1,2,3,4,5,6,7]}/>
            <Link to={GLOBAL_VARS.ACCOUNT_PORTAL_LINK}>Account</Link>
            <div>{props.activeUser.accountName}<button className="btn" onClick={props.logout}>Logout</button></div>
        </div>
    );
}