import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import {Serialize} from 'eosjs';
import {Uint64LE} from 'int64-buffer';
import * as waxjs from "@waxio/waxjs/dist";
import moment from 'moment';

import * as GLOBAL_VARS from '../../utils/vars';
import {sleep} from '../../utils/util';
import RenderNotifications from './Notifications';


const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderLoggedInHeader(props){

    const [notifications, setNotifications] = useState([]);

    function getStatBounds(statusKey){
        let reversedArray = new Uint8Array(8);
        reversedArray.set([statusKey], 7);

        let lowerBound = new Uint64LE(reversedArray).toString(10);
        console.log(lowerBound);
        for(let i=0; i<7; i++){
            reversedArray.set([0xff], i);
        }

        const upperBound = new Uint64LE(reversedArray).toString(10);

        console.log(upperBound);

        return {
            lowerBound: lowerBound,
            upperBound: upperBound,
        }
    }

    function getNameBounds(statusKey, name){
        const sb = new Serialize.SerialBuffer({
            textEncoder: new TextEncoder(),
            textDecoder: new TextDecoder()
        });
        sb.pushName(name);
        // console.log(sb.array);

        let reversedArray = new Uint8Array(16);
        reversedArray.set(sb.array.slice(0,8).reverse())
        reversedArray.set([statusKey], 8);

        const lowerHexIndex = Buffer.from(reversedArray).toString('hex');
        let lowerBound = '0x' + lowerHexIndex;

        console.log(lowerBound);

        for(let i=9; i<16; i++){
            reversedArray.set([0xff], i);
        }

        const upperHexIndex = Buffer.from(reversedArray).toString('hex');
        const upperBound = '0x' + upperHexIndex;

        console.log(upperBound);
        return {
            lowerBound: lowerBound,
            upperBound: upperBound,
        }
    }

    async function getProposals(queryType, statusKey, getBounds){
        let {lowerBound, upperBound} = getBounds(statusKey, props.activeUser.accountName);
        // console.log(lowerBound);

        let success = false;
        let proposalsArray = []
        do{
            proposalsArray = []
            try {

                let resp = {}
                do{
                    resp = await wax.rpc.get_table_rows({
                        code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        table: GLOBAL_VARS.PROPOSALS_TABLE,
                        json: true,
                        key_type: GLOBAL_VARS.PROPOSAL_INDEXES.KEY_TYPE[queryType],
                        index_position: GLOBAL_VARS.PROPOSAL_INDEXES.INDEX_POSITION[queryType],
                        lower_bound: lowerBound,
                        upper_bound: upperBound,
                        limit: 1000,
                    });
                    if(resp.rows){
                        proposalsArray = [...proposalsArray, ...resp.rows]
                    }
                    lowerBound = resp.next_key;
                }while(resp.more)                
                
                success = true;
            } catch(e) {
                console.log(e);
                success = false;
            }
        }while(!success)

        return proposalsArray;
    }

    async function checkIfVotingEnded(proposal){
        try{
            let currentVote = await wax.rpc.get_table_rows({
                code: GLOBAL_VARS.DECIDE_CONTRACT_ACCOUNT,
                scope: GLOBAL_VARS.DECIDE_CONTRACT_ACCOUNT,
                table: GLOBAL_VARS.BALLOTS_TABLE,
                json: true,
                lower_bound: proposal.ballot_name,
                upper_bound: proposal.ballot_name,
                limit: 1000
            });
            let endTime = currentVote.rows[0].end_time;
            let voteEndsIn = moment(endTime, "YYYY-MM-DDTHH:mm:ss[Z]").parseZone().fromNow();

            if(voteEndsIn.includes('ago')){
                return {...GLOBAL_VARS.NOTIFICATIONS_DICT.END_VOTING, id: proposal.proposal_id};
            }

        } catch(e){
            console.log(e);
        }
        return null;
    }

    async function getProposerEndVotingNotifications (){
        return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.VOTING_KEY, getNameBounds).then((inVotingList) => {
            let promiseList = []
            inVotingList.forEach((proposal, index) => {
                    promiseList.push(checkIfVotingEnded(proposal));
                }
            )
            // console.log(promiseList);            
            
            return Promise.all(promiseList).then(notificationList => {
                return notificationList.filter(filterNull);
            });
        })
    }

    function filterNull(notification){
        return notification;
    }

    async function getStartVotingNotifications(){
        return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.APPROVED_KEY, getNameBounds).then(approvedList => {
            return approvedList.map(proposal => {
                return {...GLOBAL_VARS.NOTIFICATIONS_DICT.START_VOTING, id: proposal.proposal_id}
            })
        });
    }

    async function checkDeliverablesStatus(proposal, statusList){
        let notificationArray = [];
        let foundDict = {}
        statusList.forEach(status => {
            foundDict[status.value] = false
        })
        try{
            let delivs = await wax.rpc.get_table_rows({
                code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                scope: proposal.proposal_id,
                table: GLOBAL_VARS.DELIVERABLES_TABLE,
                json: true,
                limit: 1000,
            });
            let deliverableList = delivs.rows;
            deliverableList.forEach(deliverable => {
                statusList.forEach(status => {
                    foundDict[status.value] = deliverable.status === status.value ? true : foundDict[status.value];
                })
            });
        } catch (e){
            console.log(e);
        }

        statusList.forEach(status => {
            if(foundDict[status.value]){
                notificationArray.push({...status.notification, id: proposal.proposal_id})
            }
        })

        return notificationArray
    }

    async function getProposerDeliverableNotifications(){
        return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY, getNameBounds).then(inProgressList =>{
            let promiseList = []
            let statusList = [{value: GLOBAL_VARS.ACCEPTED_KEY, notification: GLOBAL_VARS.NOTIFICATIONS_DICT.CLAIM_DELIVERABLE},{value: GLOBAL_VARS.REJECTED_KEY, notification: GLOBAL_VARS.NOTIFICATIONS_DICT.REJECTED_DELIVERABLE}]
            inProgressList.forEach((proposal, index) => {
                promiseList.push(checkDeliverablesStatus(proposal, statusList));
            });
            return Promise.all(promiseList).then(deliverablesNotificationColection => {
                // merge arrays into a list of notification elements, filter empty arrays
                //filtering empty arrays
                let filteredColection = deliverablesNotificationColection.filter(filterEmptyArrays);

                // merging arrays into a list
                let deliverableNotificationList = []
                filteredColection.forEach((notificationArray)=>{
                    deliverableNotificationList = [...deliverableNotificationList, ...notificationArray]
                });

                return deliverableNotificationList;
            });
        })
    }

    function filterEmptyArrays(array){
        return (array && (array.length > 0));
    }

    async function getReviewerDeliverableNotifications(){
        return getProposals("BY_REVIEWER_STAT", GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY, getNameBounds).then(inProgresProposalList => {
            let promiseList = []
            let statusList = [{value: GLOBAL_VARS.REPORTED_KEY, notification: GLOBAL_VARS.NOTIFICATIONS_DICT.DELIVERABLES_TO_REVIEW}]
            inProgresProposalList.forEach((proposal, index) => {
                promiseList.push(checkDeliverablesStatus(proposal, statusList));
            });
            return Promise.all(promiseList).then(deliverablesNotificationColection => {
                // merge arrays into a list of notification elements, filter empty arrays
                //filtering empty arrays
                let filteredColection = deliverablesNotificationColection.filter(filterEmptyArrays);

                // merging arrays into a list
                let deliverableNotificationList = []
                filteredColection.forEach((notificationArray)=>{
                    deliverableNotificationList = [...deliverableNotificationList, ...notificationArray]
                });

                return deliverableNotificationList;
            });
        })
    }

    async function getAdminToReviewNotifications(){
        return getProposals("BY_STAT_CAT", GLOBAL_VARS.SUBMITTED_KEY, getStatBounds).then(submittedList => {
            return submittedList.map(proposal => {
                return {...GLOBAL_VARS.NOTIFICATIONS_DICT.REVIEW_PENDING, id: proposal.proposal_id}
            })
        });
    }

    async function getAdminEndVotingNotifications(){
        return getProposals("BY_STAT_CAT", GLOBAL_VARS.VOTING_KEY, getStatBounds).then((inVotingList) => {
            let promiseList = []
            inVotingList.forEach((proposal, index) => {
                    promiseList.push(checkIfVotingEnded(proposal));
                }
            )
            // console.log(promiseList);            
            
            return Promise.all(promiseList).then(notificationList => {
                return notificationList.filter(filterNull);
            });
        })
    }


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

        async function getNotifications(){
            // console.log(props.isAdmin);
            let promiseList = [getProposerEndVotingNotifications(), getStartVotingNotifications(), getProposerDeliverableNotifications(), getReviewerDeliverableNotifications()]
            if(props.isAdmin){
                promiseList = [getAdminEndVotingNotifications(), getAdminToReviewNotifications(), ...promiseList]
                // getStatBounds(4);
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
            <RenderNotifications notifications={notifications}/>
            <Link to={GLOBAL_VARS.ACCOUNT_PORTAL_LINK}>Account</Link>
            <div>{props.activeUser.accountName}<button className="btn" onClick={props.logout}>Logout</button></div>
        </div>
    );
}