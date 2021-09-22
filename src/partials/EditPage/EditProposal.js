import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';
import RenderAlerts from '../Alerts/Alerts';
import {sleep} from '../../utils/util';
import {RenderDeliverablesContainer} from './DeliverablesContainer';
import RenderProposalInputContainer from './ProposalInputContainer';
import RenderLoadingPage from '../LoadingPage';
import RenderErrorPage from '../../pages/ErrorPage';

import './EditProposal.scss';

const wax = new waxjs.WaxJS({ rpcEndpoint: process.env.REACT_APP_WAX_RPC ,  tryAutoLogin: false });

export default function RenderEditProposal(props){
    const {id} = useParams();
    const [proposal, setProposal] = useState(null);
    const [editableProposal, setEditableProposal] = useState(null);
    const [deliverablesLists, setDeliverablesLists] = useState({});
    const [alertList, setAlertList] = useState([]);
    const [proposalQueryCount, setProposalQueryCount] = useState(1);
    const [queryingDeliverables, setQueryingDeliverables] = useState(false);
    const [queryingProposal, setQueryingProposal] = useState(true);
    const [totalRequested, setTotalRequested] = useState(0);
    const [validProposalData, setValidProposalData] = useState(true);
    const [validDeliverablesData, setValidDeliverablesData] = useState(true);
    const [totalRequestedErrorMessage, setTotalRequestedErrorMessage] = useState("");


    const [showValidatorMessages, setShowValidatorMessages] = useState(0);

    async function getProposalData(){
        while(true){
            try{
                /* Querying proposal data */
                let resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    table: GLOBAL_VARS.PROPOSALS_TABLE,
                    json: true,
                    lower_bound: id,
                    upper_bound: id,
                });
                let responseProposal = resp.rows[0];

                return responseProposal;

            } catch (e){
                console.log(e);
            }
        }
    }
    async function getContentData(){
        while(true){
            try{
                /* Querying content data */
                let resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    table: GLOBAL_VARS.MD_BODIES_TABLE,
                    json: true,
                    lower_bound: id,
                    upper_bound: id,
                });
                let responseProposal = resp.rows[0];

                return responseProposal;

            } catch (e){
                console.log(e);
            }
        }
    }

    useEffect(()=>{
        setQueryingProposal(true);
        let promiseList = [
            getContentData(),
            getProposalData(),
        ]
        Promise.all(promiseList)
        .then(values => {
            let proposal = {};

            values.forEach(value => {
                proposal = {...proposal, ...value}
            })

            setProposal(proposal);

            setQueryingProposal(false);
        })
        // eslint-disable-next-line
    }, [proposalQueryCount]);

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
        // Wait 5000 miliseconds before repulling data from the chain
        // to try and avoid getting unupdated state.
        setQueryingProposal(true);
        setQueryingDeliverables(true);
        await sleep(5000);
        setProposalQueryCount(proposalQueryCount + 1);
    }

    function updateDeliverablesLists(deliverablesObject){
        setDeliverablesLists(deliverablesObject);
    }

    function updateEditableProposal(editableProposal){
        setEditableProposal(editableProposal);
    }
    function updateTotalRequestedErrorMessage(errorMessage){
        setTotalRequestedErrorMessage(errorMessage);
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
                requested_amount: deliverable.requested_amount.toFixed(8) + " WAX",
                recipient: deliverable.recipient,
                small_description: deliverable.small_description,
                days_to_complete: deliverable.days_to_complete,
            },
        }
    }
    function createEditProposalAction(){
        let activeUser = props.activeUser
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.EDIT_PROPOSAL_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                proposal_id: id,
                title: editableProposal.title,
                description: editableProposal.description,
                mdbody: editableProposal.content,
                category: props.categories[editableProposal.category],
                image_url: editableProposal.image_url,
                estimated_time: editableProposal.estimated_time,
                road_map: editableProposal.road_map,
            },
        }
    }


    async function updateProposal(){
        let activeUser = props.activeUser;
        let actionList = [];
        let deliverablesObject = {...deliverablesLists};

        if(!validProposalData || !validDeliverablesData){
            showAlert(GLOBAL_ALERTS.INVALID_DATA_ALERT_DICT.WARN);
            setShowValidatorMessages(showValidatorMessages + 1);
            return
        }

        actionList.push(createEditProposalAction());
        // Remove all deliverables that are on the chain
        let removeDelivActions = deliverablesObject.toRemove.map((deliverable) => {
            // deliverable_id is the on chain id.
            return createRemoveDeliverableAction(deliverable.deliverable_id);
        });
        // Add the potential new deliverables, in the current order.
        let newDelivActions = deliverablesObject.toAdd.map((deliverable, index)=>{
            // creating deliverables 1-(deliverablesObject.toAdd.length)
            return createNewDeliverableAction(deliverable, index + 1);
        })
        // Removes come before new delivs in the array.
        actionList = [...actionList, ...removeDelivActions, ...newDelivActions]

        let signTransaction = {
            actions: actionList
        }


        try {
            await activeUser.signTransaction(
                signTransaction
                , {
                    blocksBehind: 3,
                    expireSeconds: 30
            });
            // Make a copy of the success dict.
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

    function updateDeliverablesValidationData(isValid){
        setValidDeliverablesData(isValid);
    }
    function updateProposalValidationData(isValid){
        setValidProposalData(isValid);
    }

    function runningDeliverableQuery(bool){
        setQueryingDeliverables(bool);
    }
    useEffect(()=>{
        // Updating total requested as a sum of deliverables requested.
        if(deliverablesLists.toAdd){
            let total = 0;
            deliverablesLists.toAdd.map((deliverable, index)=>{
                if((typeof deliverable.requested_amount) === "number"){
                    total += deliverable.requested_amount
                }
                return ""
            })
            setTotalRequested(total);
        }
    },[deliverablesLists]);


    if(queryingProposal){
        return <RenderLoadingPage/>
    }

    if(!proposal || !props.activeUser || (proposal.proposer !== props.activeUser.accountName))
    {
        console.log("error");
        return <RenderErrorPage/>
    }
    return(
        <div className="editProposal">
            <RenderAlerts
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <RenderProposalInputContainer
                proposal={proposal}
                categories={props.categories}
                deprecatedCategories={props.deprecatedCategories}
                queryingProposal={queryingProposal}
                totalRequestedFunds={totalRequested}
                updateTotalRequestedErrorMessage={updateTotalRequestedErrorMessage}
                updateEditableProposal={updateEditableProposal}
                activeUser={props.activeUser}
                showValidatorMessages={showValidatorMessages}
                updateValidatorData={updateProposalValidationData}
            />
            <DndProvider
                backend={HTML5Backend}
            >
                <RenderDeliverablesContainer
                    proposal={proposal}
                    updateDeliverablesLists={updateDeliverablesLists}
                    totalRequested={totalRequested}
                    activeUser={props.activeUser}
                    totalRequestedErrorMessage={totalRequestedErrorMessage}
                    showValidatorMessages={showValidatorMessages}
                    updateDeliverablesValidation={updateDeliverablesValidationData}
                    queryingDeliverables={queryingDeliverables}
                    runningQuery={runningDeliverableQuery}
                    showAlert={showAlert}
                />
            </DndProvider>
            <button
                className='button button--primary'
                onClick={updateProposal}
                disabled={(queryingDeliverables || queryingProposal)}
            >
                {/* Can't save before querying deliverables and proposal  */}
                {(queryingDeliverables || queryingProposal) ? "Loading..." : "Save draft"}
            </button>
        </div>
    )
}