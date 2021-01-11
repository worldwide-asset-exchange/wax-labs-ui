import React from 'react';
import {Link, useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import * as GLOBAL_VARS from "../../utils/vars"
import * as alertGlobals from '../../utils/alerts';
import {randomEosioName, requestedAmountToFloat} from "../../utils/util";
import { Accordion } from 'react-bootstrap';

import './ProposerMenu.scss'

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const BEGIN_VOTING_AMOUNT = 10;


export default function RenderProposerMenu(props){

    const {id} = useParams();
    async function cancelProposal(){
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.CANCEL_PROPOSAL_ACTION,
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

    async function submitProp(){
        try {
            let activeUser = props.activeUser;
            await activeUser.signTransaction({
                actions: [
                    {
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.SUBMIT_PROPOSAL_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let body = alertGlobals.SUBMIT_PROP_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id);
            let alertObj ={
                ...alertGlobals.SUBMIT_PROP_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();

        } catch(e) {
            let alertObj = {
                ...alertGlobals.SUBMIT_PROP_ALERT_DICT.ERROR,
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
                code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                scope: activeUser.accountName,
                table: GLOBAL_VARS.ACCOUNTS_TABLE,
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
                    account: GLOBAL_VARS.EOSIO_TOKEN_CODE,
                    name: GLOBAL_VARS.TRANSFER_ACTION,
                    authorization: [{
                        actor: activeUser.accountName,
                        permission: activeUser.requestPermission,
                    }],
                    data: {
                        from: activeUser.accountName,
                        to: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        quantity: GLOBAL_VARS.BEGIN_VOTING_AMOUNT,
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
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.BEGIN_VOTING_ACTION,
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

    async function endVoting (){
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.END_VOTING_ACTION,
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
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.DELETE_PROPOSAL_ACTION,
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
            props.updateProposalDeleted(true);
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
    console.log(props.proposal.status);
    if(props.activeUser && props.activeUser.accountName === props.proposal.proposer)
    {
        if(props.proposal.status === GLOBAL_VARS.DRAFTING_KEY)
        {
            return (
                <div className="proposerMenu backend-menu">
                    <h3>Proposer menu</h3>
                    <div className="proposerMenu__actions">
                        <Link className="button button--text" to="edit">Edit proposal</Link>
                        <button className="button button--text" onClick={cancelProposal}>Cancel proposal</button>
                        <button className="button button--primary" onClick={submitProp}> Submit Proposal</button>
                    </div>
                </div>
            )
        }
        else if (props.proposal.status === GLOBAL_VARS.SUBMITTED_KEY)
        {
            return (
                <div className="proposerMenu backend-menu">
                    <h3>Proposer menu</h3>
                    <div className="proposerMenu__actions">
                        <button className="button button--text" onClick={cancelProposal}>Cancel proposal</button>
                    </div>
                </div>
            )
        }
        else if (props.proposal.status === GLOBAL_VARS.APPROVED_KEY)
        {
            return (
                <div className="proposerMenu backend-menu">
                    <h3>Proposer menu</h3>
                    <div className="proposerMenu__actions">
                        <button className="button button--text" onClick={cancelProposal}>Cancel Proposal</button>
                        <button className="button button--primary" onClick={beginVoting} >Begin Voting</button>
                    </div>
                </div>
            )
        }
        else if (props.proposal.status === GLOBAL_VARS.VOTING_KEY)
        {
            return (
                <div className="proposerMenu backend-menu">
                    <h3>Proposer menu</h3>
                    <div className="proposerMenu__actions">
                        <button className="button button--text" onClick={cancelProposal}>Cancel Proposal</button>
                        {props.votingEndsIn.includes('ago') ? <button className="button button--primary" onClick={endVoting}>End Voting</button>:""}
                    </div>
                </div>
            )
        }

        else if ([GLOBAL_VARS.CANCELLED_KEY, GLOBAL_VARS.FAILED_KEY, GLOBAL_VARS.COMPLETED_KEY].includes(props.proposal.status))
        {
            return (
                <div className="proposerMenu backend-menu">
                    <h3>Proposer menu</h3>
                    <div className="proposerMenu__actions">
                        <button className="button button--primary" onClick={deleteProposal}>Delete Proposal</button>
                    </div>
                </div>
            )
        }
        else if (props.proposal.status === GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY){
            return (
                <div className="proposerMenu backend-menu">
                    <Accordion>
                        <h3>Proposer menu</h3>
                        <div className="proposerMenu__header">
                        <p>
                            This proposal is in progress.
                        </p>
                        <Accordion.Toggle as="div" eventKey="0">
                            <button className="button button--secondary">Know more</button>
                        </Accordion.Toggle>
                        </div>
                        <Accordion.Collapse eventKey="0">
                            <p className="proposerMenu__body">
                                To <span className="bold">update a deliverable</span> click on the
                                "Submit report" button, and enter a link that proves the deliverable
                                is complete, so that the assigned reviewer can approve your work.
                                You will be able to claim the requested funds of each individual
                                deliverable separetely, as soon as each is accepted.
                            </p>
                        </Accordion.Collapse>
                    </Accordion>
                </div>
            )
        }

    }
    // If none of the returns were reached, return null.
    return null
}