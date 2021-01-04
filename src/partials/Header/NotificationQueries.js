import * as waxjs from "@waxio/waxjs/dist";
import moment from 'moment';

import * as GLOBAL_VARS from '../../utils/vars';
import {getProposals, getNameBounds, getStatBounds} from '../../utils/util';



export function filterNull(notification){
    return notification;
}

export function filterEmptyArrays(array){
    return (array && (array.length > 0));
}

// statusList is the list of statuses that the function caller is looking for in the deliverables list.
// it also contains the notification to be returned, in case they are found.
export async function checkDeliverablesStatus(proposal, statusList){
    let notificationArray = [];
    let foundDict = {};
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    // In the begginning none was found
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
            // Set the flag dict to true in case it was found, if not set to previous value (if we set to false it will erase previous founds)
            statusList.forEach(status => {
                foundDict[status.value] = deliverable.status === status.value ? true : foundDict[status.value];
            })
        });
    } catch (e){
        console.log(e);
    }

    // For each found deliverable status add the notification to the return array.
    statusList.forEach(status => {
        if(foundDict[status.value]){
            notificationArray.push({...status.notification, id: proposal.proposal_id})
        }
    })

    return notificationArray
}

export async function checkIfVotingEnded(proposal){

    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
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
        //check if voting end_time has passed.
        if(voteEndsIn.includes('ago')){
            return {...GLOBAL_VARS.NOTIFICATIONS_DICT.END_VOTING, id: proposal.proposal_id};
        }

    } catch(e){
        console.log(e);
    }
    return null;
}

export async function getReviewerDeliverableNotifications(accountName){
    // Get list of proposals that have accountName as reviewer and that are inprogress.
    return getProposals("BY_REVIEWER_STAT", GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY, getNameBounds, accountName).then(inProgresProposalList => {
        let promiseList = []
        // We only want to find deliverables that are in the reported state, because those are the ones that need the reviewer's attention
        let statusList = [{value: GLOBAL_VARS.REPORTED_KEY, notification: GLOBAL_VARS.NOTIFICATIONS_DICT.DELIVERABLES_TO_REVIEW}]
        // Create a promise for each proposal.
        inProgresProposalList.forEach((proposal, index) => {
            promiseList.push(checkDeliverablesStatus(proposal, statusList));
        });
        // when all promises are resolved, return the list of deliverables.
        return Promise.all(promiseList).then(deliverablesNotificationColection => {
            // merge arrays into a list of notification elements, filter empty arrays
            //filtering empty arrays
            let filteredColection = deliverablesNotificationColection.filter(filterEmptyArrays);

            // merging arrays into a single list
            let deliverableNotificationList = []
            filteredColection.forEach((notificationArray)=>{
                deliverableNotificationList = [...deliverableNotificationList, ...notificationArray]
            });

            return deliverableNotificationList;
        });
    })
}

export async function getAdminToReviewNotifications(){
    // Get submitted proposal list by status (don't care about proposer or reviewer)
    return getProposals("BY_STAT_CAT", GLOBAL_VARS.SUBMITTED_KEY, getStatBounds).then(submittedList => {
        // Return a notification for each submmited proposal.
        return submittedList.map(proposal => {
            return {...GLOBAL_VARS.NOTIFICATIONS_DICT.REVIEW_PENDING, id: proposal.proposal_id}
        })
    });
}

export async function getAdminEndVotingNotifications(){
    // Get voting proposal list by status (don't care about proposer or reviewer)
    return getProposals("BY_STAT_CAT", GLOBAL_VARS.VOTING_KEY, getStatBounds).then((inVotingList) => {
        let promiseList = []
        // for each voting proposal, add a promise that will check if voting ended.
        inVotingList.forEach((proposal, index) => {
                promiseList.push(checkIfVotingEnded(proposal));
            }
        )
        
        // Once all promises resolved, return only the list of notifications that are not null.
        return Promise.all(promiseList).then(notificationList => {
            return notificationList.filter(filterNull);
        });
    })
}

export async function getProposerEndVotingNotifications (accountName){
    // Get proposals that have the accountName as proposer and are in voting.
    return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.VOTING_KEY, getNameBounds, accountName).then((inVotingList) => {
        let promiseList = []
        // for each of those add a promise that will check if the voting of that proposal has ended.
        inVotingList.forEach((proposal, index) => {
                promiseList.push(checkIfVotingEnded(proposal));
            }
        )   
        
        // Wait for all the promises to be resolved, then return the list (filtering the null returns out)
        return Promise.all(promiseList).then(notificationList => {
            return notificationList.filter(filterNull);
        });
    })
}

export async function getProposerDeliverableNotifications(accountName){
    // Get proposals that have the accountName as the proposal, and are inprogress.
    return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY, getNameBounds, accountName).then(inProgressList =>{
        let promiseList = []
        // StatusList contains both accepted and rejected status key for deliverables
        // In case accepted is found, return the CLAIM_DELIVERABLE notification
        // In case rejected is found, return the REJECTED_DELIVERABLE notification
        let statusList = [
            {value: GLOBAL_VARS.ACCEPTED_KEY, notification: GLOBAL_VARS.NOTIFICATIONS_DICT.CLAIM_DELIVERABLE},
            {value: GLOBAL_VARS.REJECTED_KEY, notification: GLOBAL_VARS.NOTIFICATIONS_DICT.REJECTED_DELIVERABLE}
        ]
        // Add a promise that will check deliverables status of each of the proposals against created statusList.
        inProgressList.forEach((proposal, index) => {
            promiseList.push(checkDeliverablesStatus(proposal, statusList));
        });

        // Since the promises of promiseList return each a list, now we have a "collection"
        // the then code merges them into a single list of notifications.
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
    // Get all proposals that have accountName as proposer, and are in the approved status.
    return getProposals("BY_PROPOSER_STAT", GLOBAL_VARS.APPROVED_KEY, getNameBounds, accountName).then(approvedList => {
        // Add a notification object for each, since all that are approved need the start voting action called.
        return approvedList.map(proposal => {
            return {...GLOBAL_VARS.NOTIFICATIONS_DICT.START_VOTING, id: proposal.proposal_id}
        })
    });
}
