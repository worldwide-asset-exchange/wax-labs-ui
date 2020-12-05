import React from 'react';
import {Link, useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import {randomEosioName} from "../../utils/util";

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
                        account: 'labs',
                        name: 'cancelprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
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
            let alertObj = {
                title: "Proposal cancelled!",
                body: "Proposal was successfully cancelled.", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch(e) {
            let alertObj = {
                title: "Cancel error!",
                body: "Cancel encountered an error.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
            }
            props.showAlert(alertObj);
            console.log(e);
        }     
    }
    
    async function beginVoting() {
        try {
            let activeUser = props.activeUser;
            let resp = await wax.rpc.get_table_rows({             
                code: 'labs',
                scope: activeUser.accountName,
                table: 'accounts',
                json: true,
                limit: 1
            });

            let balanceAmount = '0';
            if(resp.rows.length){
                const balance = resp.rows[0].balance;
              
                balanceAmount = balance.replace(' WAX', '');
            }

            balanceAmount = parseFloat(balanceAmount);
            let transferAction = []
            if(balanceAmount < BEGIN_VOTING_AMOUNT){
                transferAction = [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: activeUser.accountName,
                        permission: 'active',
                    }],
                    data: {
                        from: activeUser.accountName,
                        to: 'labs',
                        quantity: '10.00000000 WAX',
                        memo: ''
                    },
                }]
            }
            // If balanceAmount was lesser than BEGIN_VOTING_AMOUNT
            // transferAction is empty, so the spread has no effect.
            // This is so that we don't have to replicate signTransaction code.
            let ballotName = randomEosioName(12);
            await activeUser.signTransaction({
                actions: [
                    ...transferAction,
                    {
                        account: 'labs',
                        name: 'beginvoting',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
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

            let alertObj = {
                title: "Begin voting success!",
                body: "Proposal is now in the voting stage.", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();


        } catch(e){
            let alertObj = {
                title: "Begin voting error!",
                body: "An error ocurred when trying to call the begin voting action.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
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
                        account: 'labs',
                        name: 'endvoting',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let alertObj = {
                title: "End voting success!",
                body: "Proposal voting was ended.", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch(e) {
            let alertObj = {
                title: "End voting error!",
                body: "An error ocurred when trying to call the end voting action.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
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
                        account: 'labs',
                        name: 'deleteprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let alertObj = {
                title: "Delete proposal success!",
                body: "Proposal was deleted.", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
        } catch(e) {
            let alertObj = {
                title: "Delete proposal error!",
                body: "An error ocurred when trying to call the delete proposal action.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
            }
            props.showAlert(alertObj);
            console.log(e);
        }
    }
    // check if activeUser is the same as the proposal's proposer.
    if(props.activeUser && props.activeUser.accountName === props.proposal.proposer)
    {   
        if(props.proposal.status === "drafting")
        {
            return (           
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <Link className="btn" to="edit">Edit proposal</Link>
                    <button className="btn" onClick={cancelProposal}>Cancel proposal</button>                
                </div>
            )
        }
        else if (props.proposal.status === "submitted")
        {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <button className="btn" onClick={cancelProposal}>Cancel proposal</button>                
                </div>
            )
        } 
        else if (props.proposal.status === "approved")
        {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <button className="btn" onClick={beginVoting} >Begin Voting</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>               
                </div>
            )
        } 
        else if (props.proposal.status === "voting")
        {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    {props.votingEndsIn.includes('ago') ? <button className="btn" onClick={endVoting}>End Voting</button>:""}
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>               
                </div>
            )
        }
        else if (["cancelled", "failed", "completed"].includes(props.proposal.status))
        {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>               
                </div>
            )
        }
        else if (props.proposal.status === "inprogress"){
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer menu</h3>
                    <h5>
                        This proposal is in progress. To update a deliverable click on the 
                        "Submit report" button, and enter a link that proves the deliverable 
                        is complete, so that the assigned reviewer can approve your work. 
                        You will be able to claim the requested funds of each individual
                        deliverable separetely, as soon as each is approved.
                    </h5>
                </div>
            )
        }

    }
    // If none of the returns was reached, return null.
    return null
}