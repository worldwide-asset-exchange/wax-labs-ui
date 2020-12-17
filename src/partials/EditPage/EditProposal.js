import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';
import RenderAlerts from '../ProposalPage/Alerts';
import {requestedAmountToFloat, sleep} from '../../utils/util';
import {RenderDeliverablesContainer} from './DeliverablesContainer';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderEditProposal(props){
    const {id} = useParams();
    const [proposal, setProposal] = useState(null);
    const [deliverableLists, setDeliverablesLists] = useState({});
    const [alertList, setAlertList] = useState([]);
    const [proposalQueryCount, setProposalQueryCount] = useState(1);
    const [queryingDeliverables, setQueryingDeliverables] = useState(true);
    const [queryingProposal, setQueryingProposal] = useState(true);

    async function getProposalData(){
        setQueryingProposal(true);
        try{
            /* Getting Proposal info */
            let resp = await wax.rpc.get_table_rows({             
                code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                table: GLOBAL_VARS.PROPOSALS_TABLE,
                json: true,
                lower_bound: id,
                upper_bound: id,
            });
            let responseProposal = resp.rows[0]
            responseProposal.total_requested_funds = requestedAmountToFloat(responseProposal.total_requested_funds) + ' WAX';
            setProposal(responseProposal);
           
        } catch (e){
            console.log(e);
        }
        setQueryingProposal(false);
    }

    function showAlert(alertObj){
        // Make a copy.
        let alerts = alertList.slice(0);
        // Push new alert to the copied list
        alerts.push(alertObj);
        // Update the list.
        setAlertList(alerts);
    }
    function removeAlert(index){
        // Make a copy.
        let alerts = alertList.slice(0);
        // remove alert at index.
        alerts.splice(index,1);
        // Update the list.
        setAlertList(alerts);
    }

    async function rerunProposalQuery(){
        // Wait 3000 miliseconds before repulling data from the chain
        // to avoid getting unupdated state.
        setQueryingProposal(true);
        setQueryingDeliverables(true);
        await sleep(3000);
        setProposalQueryCount(proposalQueryCount + 1);
    }

    function updateDeliverablesLists(deliverablesObject){
        setDeliverablesLists(deliverablesObject);
    }

    function createRemoveDeliverableAction(deliverableId){
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.REMOVE_DELIVERABLE_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                proposal_id: id,
                deliverable_id: deliverableId,                   
            },
        }
    }
    function createNewDeliverableAction(deliverable, deliverableId){
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.NEW_DELIVERABLE_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                proposal_id: id,
                deliverable_id: deliverableId,
                requested_amount: deliverable.requested,
                recipient: deliverable.recipient,                   
            },
        }
    }


    async function updateProposal(){
        let activeUser = props.activeUser;
        let actionList = [];
        let deliverablesObject = {...deliverableLists};
        // Remove all deliverables that are on the chain
        let removeDelivActions = deliverablesObject.toRemove.map((deliverable) => {
            return createRemoveDeliverableAction(deliverable.deliverable_id);
        });
        // Add the potential new deliverables, in the current order.
        let newDelivActions = deliverablesObject.toAdd.map((deliverable, index)=>{
            return createNewDeliverableAction(deliverable, index + 1);
        })
        // Removes come first in the array.
        actionList = [...removeDelivActions, ...newDelivActions]
        try {
            await activeUser.signTransaction({
                actions: actionList
            }, {
                    blocksBehind: 3,
                    expireSeconds: 30
            });
            let body = GLOBAL_ALERTS.SAVE_DRAFT_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(GLOBAL_ALERTS.PROPOSAL_ID_TEMPLATE, id);
            let alertObj ={
                ...GLOBAL_ALERTS.SAVE_DRAFT_ALERT_DICT.SUCCESS,
                body: body,
            }
            showAlert(alertObj);
            rerunProposalQuery();

        } catch(e){
            let alertObj = {
                ...GLOBAL_ALERTS.SAVE_DRAFT_ALERT_DICT.ERROR,
                details: e.message 
            }
            showAlert(alertObj);

            console.log(e);
        }
    }
    

    useEffect(()=>{
        getProposalData();
        // eslint-disable-next-line
    }, [proposalQueryCount]);
    
    function runningDeliverableQuery(bool){
        setQueryingDeliverables(bool);
    }

    return(
        <div className="edit-proposal">
            <RenderAlerts 
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <DndProvider backend={HTML5Backend}>
                <RenderDeliverablesContainer 
                    proposal={proposal} 
                    updateDeliverablesLists={updateDeliverablesLists}
                    activeUser={props.activeUser}
                    queryingDeliverables={queryingDeliverables}
                    runningQuery={runningDeliverableQuery}
                    showAlert={showAlert}
                />
            </DndProvider>
            <button 
                className='btn' 
                onClick={updateProposal}
                disabled={(queryingDeliverables || queryingProposal)}
            >
                {(queryingDeliverables || queryingProposal) ? "Loading..." : "Save draft"}
            </button>
        </div>
    )
}