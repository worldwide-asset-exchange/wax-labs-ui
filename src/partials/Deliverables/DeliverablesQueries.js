import * as waxjs from "@waxio/waxjs/dist";

import * as GLOBAL_VARS from '../../utils/vars';
import {getProposals} from '../../utils/util';
import { filterNull } from "../Header/NotificationQueries";


async function checkDeliverableList(proposal, statusList){
    let returnProposal = null
    let foundDict = {};
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    // In the begginning none was found
    statusList.forEach(status => {
        foundDict[status] = false
    })
    try{
        let delivs = await wax.rpc.get_table_rows({
            code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            scope: proposal.proposal_id,
            table: GLOBAL_VARS.DELIVERABLES_TABLE,
            json: true,
            limit: 1000,
        });
        let deliverablesList = delivs.rows;
        deliverablesList.forEach(deliverable => {
            // Set the flag dict to true in case it was found, if not set to previous value (if we set to false it will erase previous founds)
            statusList.forEach(status => {
                foundDict[status] = deliverable.status === status ? true : foundDict[status];
            })
        });
    } catch (e){
        console.log(e);
    }

    // For each found deliverable status add the notification to the return array.
    statusList.forEach(status => {
        if(foundDict[status]){
           returnProposal = proposal;
        }
    })

    return returnProposal
}

export async function getProposalsWithDeliverablesInPassedStatus(queryType, statusKey, getBounds, accountName, deliverableStatusKeyList){
    return getProposals(queryType, statusKey, getBounds, accountName).then((proposalList) => {
        let promiseList = proposalList.map((proposal) => {
            return checkDeliverableList(proposal, deliverableStatusKeyList);
        });
        return Promise.all(promiseList).then(proposalList => {
            let filteredList = proposalList.filter(filterNull);

            return filteredList;
        });
    })
}