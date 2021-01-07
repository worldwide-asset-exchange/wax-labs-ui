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
                    ...promiseList,
                    getAdminEndVotingNotifications(), 
                    getAdminToReviewNotifications(),
                ];
            }
            Promise.all(promiseList)
            .then(values =>{
                let notifications = []
                values.forEach(list => {
                    notifications = [...notifications, ...list]
                })
                // if dependency arrays changes cause useEffect to run again, we don't update state.
                if(!cancelled){
                    setNotifications(notifications);
                    setQuerying(false);
                }
            });
        }
        // Needed because if querying admin hasn't happened yet, we might get wrong notification list...
        // Causing some weird interface behaviour (loading, x notifications => loading, y notifications)
        if(!props.queryingAdmin && !props.queryingCategories){
            console.log("getting notifications")
            getNotifications();
        }   
        const cleanup = () => {cancelled = true;}
        return cleanup
    },[props.activeUser, props.isAdmin, props.queryingAdmin, props.queryingCategories]);

    return (
        <div>
            <Link to={GLOBAL_VARS.PROPOSALS_LINK}>Proposals</Link>
            <RenderNotifications notifications={notifications} querying={querying}/>
            <Link to={GLOBAL_VARS.ACCOUNT_PORTAL_LINK}>Account</Link>
            <div>{props.activeUser.accountName}<button className="btn" onClick={props.logout}>Logout</button></div>
        </div>
    );
}