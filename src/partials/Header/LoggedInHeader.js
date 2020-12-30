import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import {Serialize} from 'eosjs';
import * as waxjs from "@waxio/waxjs/dist";
import moment from 'moment';

import * as GLOBAL_VARS from '../../utils/vars';
import {sleep} from '../../utils/util';
import RenderNotifications from './Notifications';


const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderLoggedInHeader(props){

    function getNameBounds(name, statusKey){
        const sb = new Serialize.SerialBuffer({
            textEncoder: new TextEncoder(),
            textDecoder: new TextDecoder()
        });
        sb.pushName(name);
        console.log(sb.array);

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
    async function getProposalsByName(queryType, statusKey){
        let {lowerBound, upperBound} = getNameBounds(props.activeUser.accountName, statusKey);
        console.log(lowerBound);

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
                        limit: 10,
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

    async function getEndVotingNotifications (){
        return getProposalsByName("BY_PROPOSER_STAT", GLOBAL_VARS.VOTING_KEY).then((inVotingList) => {
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
        return getProposalsByName("BY_PROPOSER_STAT", GLOBAL_VARS.APPROVED_KEY).then(approvedList => {
            return approvedList.map(proposal => {
                return {...GLOBAL_VARS.NOTIFICATIONS_DICT.START_VOTING, id: proposal.proposal_id}
            })
        });
    }

    async function checkDeliverablesStatus(proposal){
        let notificationArray = [];
        let acceptedFound = false;
        let rejectedFound = false;
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
                acceptedFound = deliverable.status === GLOBAL_VARS.ACCEPTED_KEY ? true : acceptedFound;
                rejectedFound = deliverable.status === GLOBAL_VARS.REJECTED_KEY ? true : rejectedFound;
            });
        } catch (e){
            console.log(e);
        }
        if(acceptedFound){
            notificationArray.push({...GLOBAL_VARS.NOTIFICATIONS_DICT.CLAIM_DELIVERABLE, id: proposal.proposal_id})
        }
        if(rejectedFound){
            notificationArray.push({...GLOBAL_VARS.NOTIFICATIONS_DICT.REJECTED_DELIVERABLE, id: proposal.proposal_id})    
        }

        return notificationArray
    }

    async function getProposerDeliverableNotifications(){
        return getProposalsByName("BY_PROPOSER_STAT", GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY).then(inProgressList =>{
            let promiseList = []
            inProgressList.forEach((proposal, index) => {
                    promiseList.push(checkDeliverablesStatus(proposal));
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

    async function getNotifications(){

        // Promise.all([getEndVotingNotifications(), getStartVotingNotifications(), getProposerDeliverableNotifications()])
        Promise.all([getProposerDeliverableNotifications()])
        .then(values =>{
            let notifications = []
            values.forEach(list => {
                notifications = [...notifications, ...list]
            })
            console.log(notifications);
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
        getNotifications();
       
    },[props.activeUser]);

    return (
        <div>
            <Link to={GLOBAL_VARS.PROPOSALS_LINK}>Proposals</Link>
            <RenderNotifications notifications={[1,2,3,4,5,6,7]}/>
            <Link to={GLOBAL_VARS.ACCOUNT_PORTAL_LINK}>Account</Link>
            <div>{props.activeUser.accountName}<button className="btn" onClick={props.logout}>Logout</button></div>
        </div>
    );
}