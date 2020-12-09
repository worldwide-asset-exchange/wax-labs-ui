import React from 'react';
import {Link, useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import * as globals from "../../utils/vars"
import * as alertGlobals from '../../utils/alerts';
import {randomEosioName, requestedAmountToFloat} from "../../utils/util";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const BEGIN_VOTING_AMOUNT = 10;


export default function RenderProposerMenu(props){
   
    const {id} = useParams();
    // console.log(props);
    async function cancelProposal(){
        let activeUser = props.activeUser;
        try {        
            await activeUser.signTransaction({
                actions: [
                    {
                        account: globals.LABS_CONTRACT_ACCOUNT,
                        name: globals.CANCEL_PROPOSAL_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                            memo: ''
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });            
            let body = alertGlobals.CANCEL_PROP_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id);
            let alertObj ={
                ...alertGlobals.CANCEL_PROP_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch(e) {
            let alertObj = {
                ...alertGlobals.CANCEL_PROP_ALERT_DICT.ERROR,
                details: e.message 
            }
            props.showAlert(alertObj);
            console.log(e);
        }     
    }
    
    async function beginVoting() {
        try {
            let activeUser = props.activeUser;
            let resp = await wax.rpc.get_table_rows({             
                code: globals.LABS_CONTRACT_ACCOUNT,
                scope: activeUser.accountName,
                table: globals.ACCOUNTS_TABLE,
                json: true,
                limit: 1
            });

            let balanceAmount = '0.0 WAX';
            if(resp.rows.length){
                balanceAmount = resp.rows[0].balance;              
            }

            balanceAmount = requestedAmountToFloat(balanceAmount);
            let transferAction = []

            if(balanceAmount < BEGIN_VOTING_AMOUNT){
                transferAction = [{
                    account: globals.EOSIO_TOKEN_CODE,
                    name: globals.TRANSFER_ACTION,
                    authorization: [{
                        actor: activeUser.accountName,
                        permission: activeUser.requestPermission,
                    }],
                    data: {
                        from: activeUser.accountName,
                        to: globals.LABS_CONTRACT_ACCOUNT,
                        quantity: globals.BEGIN_VOTING_AMOUNT,
                        memo: ''
                    },
                }]
            }
            let ballotName = randomEosioName(12);
            // If balanceAmount was lesser than BEGIN_VOTING_AMOUNT
            // transferAction is empty, so the spread has no effect.
            // This is so that we don't have to replicate signTransaction code.
            await activeUser.signTransaction({
                actions: [
                    ...transferAction,
                    {
                        account: globals.LABS_CONTRACT_ACCOUNT,
                        name: globals.BEGIN_VOTING_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                            ballot_name: ballotName,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });

            let body = alertGlobals.BEGIN_VOTING_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id)

            let alertObj = {
                ...alertGlobals.BEGIN_VOTING_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();


        } catch(e){
            let alertObj = {
                ...alertGlobals.BEGIN_VOTING_ALERT_DICT.ERROR,
                details: e.message, 
            }
            props.showAlert(alertObj);
            console.log(e);
        }

    }

    // I'm leaving this here, it was a test that I did to validate my strategy
    // For the edit proposal code me and Karyne have in mind. We will do something
    // similar there (when user wants to update deliverables). I will add a stub
    // deliverable, so that I can remove all of them, then add them in the 
    // new order, lastly I will remove the stub deliverable. (if you just try
    // to remove all then add them back, it will fail because you need at 
    // least one deliverable at any point).
    // async function magic(){
    //     let activeUser = props.activeUser
    //     try{

    //         await activeUser.signTransaction({
    //             actions: [
    //                 {
    //                     account: 'labs',
    //                     name: 'newdeliv',
    //                     authorization: [{
    //                         actor: activeUser.accountName,
    //                         permission: 'active',
    //                     }],
    //                     data: {
    //                         proposal_id: 24,
    //                         deliverable_id: 10,
    //                         requested_amount: "1000.00000000 WAX",
    //                         recipient: "ancientsofia"
    //                     },
    //                 },
    //                 {
    //                     account: 'labs',
    //                     name: 'rmvdeliv',
    //                     authorization: [{
    //                         actor: activeUser.accountName,
    //                         permission: 'active',
    //                     }],
    //                     data: {
    //                         proposal_id: 24,
    //                         deliverable_id: 2,
    //                     },
    //                 },
    //                 {
    //                     account: 'labs',
    //                     name: 'newdeliv',
    //                     authorization: [{
    //                         actor: activeUser.accountName,
    //                         permission: 'active',
    //                     }],
    //                     data: {
    //                         proposal_id: 24,
    //                         deliverable_id: 3,
    //                         requested_amount: "1000.00000000 WAX",
    //                         recipient: "ancientsofia"
    //                     },
    //                 },
    //                 {
    //                     account: 'labs',
    //                     name: 'rmvdeliv',
    //                     authorization: [{
    //                         actor: activeUser.accountName,
    //                         permission: 'active',
    //                     }],
    //                     data: {
    //                         proposal_id: 24,
    //                         deliverable_id: 10,
    //                     },
    //                 },
    //             ]} , {
    //             blocksBehind: 3,
    //             expireSeconds: 30
    //         });
    //         let alertObj = {
    //             title: "Magic success!",
    //             body: "Magic was performed.", 
    //             variant: "success",
    //             dismissible: true,
    //         }
    //         props.showAlert(alertObj);
    //         props.rerunProposalQuery();
    //     } catch (e){
    //         let alertObj = {
    //             title: "Magic error!",
    //             body: "Magic action error.",
    //             details: e.message, 
    //             variant: "danger",
    //             dismissible: true,
    //         }
    //         props.showAlert(alertObj);
    //         console.log(e);
    //     }
    // }

    async function endVoting (){
        let activeUser = props.activeUser;
        try {        
            await activeUser.signTransaction({
                actions: [
                    {
                        account: globals.LABS_CONTRACT_ACCOUNT,
                        name: globals.END_VOTING_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let body = alertGlobals.END_VOTING_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id)

            let alertObj = {
                ...alertGlobals.END_VOTING_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch(e) {
            let alertObj = {
                ...alertGlobals.END_VOTING_ALERT_DICT.ERROR,
                details: e.message,
            }
            props.showAlert(alertObj);
            console.log(e);
        }
    }
    async function deleteProposal(){
        let activeUser = props.activeUser;
        try {        
            await activeUser.signTransaction({
                actions: [
                    {
                        account: globals.LABS_CONTRACT_ACCOUNT,
                        name: globals.DELETE_PROPOSAL_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let body = alertGlobals.DELETE_PROP_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id);
            let alertObj = {
                ...alertGlobals.DELETE_PROP_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
        } catch(e) {
            let alertObj = {
                ...alertGlobals.DELETE_PROP_ALERT_DICT.ERROR,
                details: e.message, 
            }
            props.showAlert(alertObj);
            console.log(e);
        }
    }
    // check if activeUser is the same as the proposal's proposer.
    if(props.activeUser && props.activeUser.accountName === props.proposal.proposer)
    {   
        if(props.proposal.status === globals.DRAFTING_KEY)
        {
            return (           
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <Link className="btn" to="edit">Edit proposal</Link>
                    <button className="btn" onClick={cancelProposal}>Cancel proposal</button>                
                </div>
            )
        }
        else if (props.proposal.status === globals.SUBMITTED_KEY)
        {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <button className="btn" onClick={cancelProposal}>Cancel proposal</button>                
                </div>
            )
        } 
        else if (props.proposal.status === globals.APPROVED_KEY)
        {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <button className="btn" onClick={beginVoting} >Begin Voting</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>               
                </div>
            )
        } 
        else if (props.proposal.status === globals.VOTING_KEY)
        {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    {props.votingEndsIn.includes('ago') ? <button className="btn" onClick={endVoting}>End Voting</button>:""}
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>               
                </div>
            )
        }
        
        else if ([globals.CANCELLED_KEY, globals.FAILED_KEY, globals.COMPLETED_KEY].includes(props.proposal.status))
        {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>               
                </div>
            )
        }
        else if (props.proposal.status === globals.INPROGRESS_KEY){
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <h5>
                        This proposal is in progress. To update a deliverable click on the 
                        "Submit report" button, and enter a link that proves the deliverable 
                        is complete, so that the assigned reviewer can approve your work. 
                        You will be able to claim the requested funds of each individual
                        deliverable separetely, as soon as each is accepted.
                    </h5>
                </div>
            )
        }

    }
    // If none of the returns were reached, return null.
    return null
}