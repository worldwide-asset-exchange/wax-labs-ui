import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'

import * as GLOBAL_VARS from '../../utils/vars';
import RenderNotifications from './Notifications';
import {
    getProposerEndVotingNotifications, 
    getStartVotingNotifications, 
    getProposerDeliverableNotifications, 
    getReviewerDeliverableNotifications, 
    getAdminEndVotingNotifications, 
    getAdminToReviewNotifications
} from './NotificationQueries'

export default function RenderLoggedInHeader(props){

    const [notifications, setNotifications] = useState([]);
    const [querying, setQuerying] = useState(true);

    useEffect(()=>{
        let cancelled = false;
        setQuerying(true);
        async function getNotifications(){
            let promiseList = [
                getProposerEndVotingNotifications(props.activeUser.accountName),
                getStartVotingNotifications(props.activeUser.accountName), 
                getProposerDeliverableNotifications(props.activeUser.accountName), 
                getReviewerDeliverableNotifications(props.activeUser.accountName)
            ];
            if(props.isAdmin){
                promiseList = [
                    getAdminEndVotingNotifications(), 
                    getAdminToReviewNotifications(),
                    ...promiseList
                ];
            }
            Promise.all(promiseList)
            .then(values =>{
                let notifications = []
                values.forEach(list => {
                    notifications = [...notifications, ...list]
                })
                if(!cancelled){
                    setNotifications(notifications);
                    setQuerying(false);
                }
            })
        }   
        getNotifications();
        const cleanup = () => cancelled = true;
        return cleanup
    },[props.activeUser, props.isAdmin]);

    return (
        <div>
            <Link to={GLOBAL_VARS.PROPOSALS_LINK}>Proposals</Link>
            <RenderNotifications notifications={notifications} querying={querying}/>
            <Link to={GLOBAL_VARS.ACCOUNT_PORTAL_LINK}>Account</Link>
            <div>{props.activeUser.accountName}<button className="btn" onClick={props.logout}>Logout</button></div>
        </div>
    );
}