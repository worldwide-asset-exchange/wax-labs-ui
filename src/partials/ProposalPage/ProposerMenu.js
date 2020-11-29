import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const BEGIN_VOTING_AMOUNT = 10;


export default function RenderProposerMenu(props){
    RenderProposerMenu.propTypes = {
        activeUser: PropTypes.any.isRequired,
        proposal: PropTypes.any.isRequired,
        votingEndsIn: PropTypes.any.isRequired,
        showAlert: PropTypes.func.isRequired,
        rerunProposalQuery: PropTypes.func.isRequired,
    }
    const {id} = useParams();
    
    async function cancelProposal(){
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
                variant: "primary",
                dismissable: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch(e) {
            let alertObj = {
                title: "Cancel error!",
                body: "Cancel encountered an error.",
                details: e.message, 
                variant: "danger",
                dismissable: true,
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

            let amount = '0';
            if(resp.rows.length){
                const balance = resp.rows[0].balance;
              
                amount = balance.replace(' WAX', '');
            }

            amount = parseFloat(amount);
            let transferAction = []
            if(amount < BEGIN_VOTING_AMOUNT){
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
                            ballot_name: 'wlabs' + id,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });

            let alertObj = {
                title: "Begin voting success!",
                body: "Proposal is now in the voting stage.", 
                variant: "primary",
                dismissable: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();


        } catch(e){
            let alertObj = {
                title: "Begin voting error!",
                body: "An error ocurred when trying to call the begin voting action.",
                details: e.message, 
                variant: "danger",
                dismissable: true,
            }
            props.showAlert(alertObj);
            console.log(e);
        }

    }


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
    return null
}