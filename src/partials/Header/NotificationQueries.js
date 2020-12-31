
import {Serialize} from 'eosjs';
import {Uint64LE} from 'int64-buffer';
import * as waxjs from "@waxio/waxjs/dist";
import moment from 'moment';

import * as GLOBAL_VARS from '../../utils/vars';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export function getStatBounds(statusKey){
    let reversedArray = new Uint8Array(8);
    reversedArray.set([statusKey], 7);

    let lowerBound = new Uint64LE(reversedArray).toString(10);

    for(let i=0; i<7; i++){
        reversedArray.set([0xff], i);
    }

    const upperBound = new Uint64LE(reversedArray).toString(10);


    return {
        lowerBound: lowerBound,
        upperBound: upperBound,
    }
}

export function getNameBounds(statusKey, name){
    const sb = new Serialize.SerialBuffer({
        textEncoder: new TextEncoder(),
        textDecoder: new TextDecoder()
    });
    sb.pushName(name);
    // console.log(sb.array);

    let reversedArray = new Uint8Array(16);
    reversedArray.set(sb.array.slice(0,8).reverse());
    reversedArray.set([statusKey], 8);

    const lowerHexIndex = Buffer.from(reversedArray).toString('hex');
    let lowerBound = '0x' + lowerHexIndex;

    for(let i=9; i<16; i++){
        reversedArray.set([0xff], i);
    }

    const upperHexIndex = Buffer.from(reversedArray).toString('hex');
    const upperBound = '0x' + upperHexIndex;

    return {
        lowerBound: lowerBound,
        upperBound: upperBound,
    }
}

export async function getProposals(queryType, statusKey, getBounds, accountName){
    let {lowerBound, upperBound} = getBounds(statusKey, accountName);
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

export function filterNull(notification){
    return notification;
}

export function filterEmptyArrays(array){
    return (array && (array.length > 0));
}

export async function checkDeliverablesStatus(proposal, statusList){
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

export async function checkIfVotingEnded(proposal){
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

export async function getReviewerDeliverableNotifications(accountName){
    return getProposals("BY_REVIEWER_STAT", GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY, getNameBounds, accountName).then(inProgresProposalList => {
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

export async function getAdminToReviewNotifications(){
    return getProposals("BY_STAT_CAT", GLOBAL_VARS.SUBMITTED_KEY, getStatBounds).then(submittedList => {
        return submittedList.map(proposal => {
            return {...GLOBAL_VARS.NOTIFICATIONS_DICT.REVIEW_PENDING, id: proposal.proposal_id}
        })
    });
}

export async function getAdminEndVotingNotifications(){
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

export async function getProposerEndVotingNotifications (accountName){
    return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.VOTING_KEY, getNameBounds, accountName).then((inVotingList) => {
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

export async function getProposerDeliverableNotifications(accountName){
    return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY, getNameBounds, accountName).then(inProgressList =>{
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

export async function getStartVotingNotifications(accountName){
    return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.APPROVED_KEY, getNameBounds, accountName).then(approvedList => {
        return approvedList.map(proposal => {
            return {...GLOBAL_VARS.NOTIFICATIONS_DICT.START_VOTING, id: proposal.proposal_id}
        })
    });
}
