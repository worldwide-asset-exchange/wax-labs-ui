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
        // *proposals that the user is the proposer*
        // getApprovedProposals();//proposals to start voting -> links to proposal
        // getEndVotingProposals();//proposals to end voting, if voting period is over -> links to proposal
        //proposals with rejected deliverables -> links to proposal
        //proposals with accepted deliverables -> links to proposal
        // *proposals that the user is the reviewer*
        // proposals inprogress with reported deliverables ->  links to proposal
        // *admin only*
        // proposals that are submitted (in need of review) -> links to proposal
        

        // console.log(number.toString());
        // // 3805793813294937472
        // console.log(number - 0);
        // // 3805793813294937600

        let cancelled = false;
        setQuerying(true);
        async function getNotifications(){
            // console.log(props.isAdmin);
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
            // Promise.all([])
            .then(values =>{
                let notifications = []
                // console.log(values);
                values.forEach(list => {
                    notifications = [...notifications, ...list]
                })
                if(!cancelled){
                    console.log(notifications);
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