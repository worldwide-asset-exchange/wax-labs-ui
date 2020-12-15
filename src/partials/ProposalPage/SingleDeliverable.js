import React, {useState} from 'react';
import {useParams} from 'react-router-dom';

import * as GLOBAL_VARS from '../../utils/vars';
import * as alertGlobals from "../../utils/alerts";
import {requestedAmountToFloat} from '../../utils/util';

const readableStatusName = GLOBAL_VARS.READABLE_DELIVERABLE_STATUS

export default function RenderSingleDeliverable(props){
    
    const [reportLink, setReportLink] = useState("");
    const [reviewMemo, setReviewMemo] = useState("");
    const {id} = useParams();

    let deliverable = {...props.deliverable};
    /* Making a copy of the requested_raw */
    deliverable.requested_raw = deliverable.requested.slice();

    deliverable.requested = requestedAmountToFloat(deliverable.requested) + " WAX";

   
    function handleReviewMemoChange(event){
        setReviewMemo(event.target.value);
    }
    function handleReportLinkChange(event){
        setReportLink(event.target.value);
    }

    async function reviewReport(accept){
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.REVIEW_DELIVERABLE_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                            deliverable_id: deliverable.deliverable_id,
                            accept: accept,                               
                            memo: reviewMemo,                         
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let body = alertGlobals.REVIEW_DELIVERABLE_ALERT_DICT.SUCCESS.body.slice(0)
            body = body.replace(alertGlobals.ACCEPT_TEMPLATE, accept ? "accepted": "rejected");
            body = body.replace(alertGlobals.DELIVERABLE_ID_TEMPLATE, deliverable.deliverable_id);
            let alertObj = {
                ...alertGlobals.REVIEW_DELIVERABLE_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
         } catch(e){
            let alertObj = {
                ...alertGlobals.REVIEW_DELIVERABLE_ALERT_DICT.ERROR,
                details: e.message,
            }
            props.showAlert(alertObj);
            console.log(e);
         }
    }
    async function submitReport(){
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.SUBMIT_REPORT_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                            deliverable_id: deliverable.deliverable_id,
                            report: reportLink,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let body = alertGlobals.SUBMIT_REPORT_ALERT_DICT.SUCCESS.body.slice(0)
            body = body.replace(alertGlobals.DELIVERABLE_ID_TEMPLATE, deliverable.deliverable_id);
            let alertObj = {
                ...alertGlobals.SUBMIT_REPORT_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();          
         } catch(e){
            let alertObj = {
                ...alertGlobals.SUBMIT_REPORT_ALERT_DICT.ERROR,
                details: e.message, 
            }
            props.showAlert(alertObj);
            console.log(e);
         }
    }
    async function claimFunds(){
        let activeUser = props.activeUser;
        try {
            let withdrawAction = []
            // If the active user is also the recipient, 
            // add the withdraw action to the transaction.
            // If not leave it empty.
            if(activeUser.accountName === deliverable.recipient){
                withdrawAction.push(
                {
                    account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    name: GLOBAL_VARS.WITHDRAW_ACTION,
                    authorization: [{
                        actor: activeUser.accountName,
                        permission: activeUser.requestPermission,
                    }],
                    data: {
                        account_owner: activeUser.accountName,
                        quantity: deliverable.requested_raw,
                    },
                })
            }
            await activeUser.signTransaction({
                actions: [
                    {
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.CLAIM_FUNDS_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                            deliverable_id: deliverable.deliverable_id,
                        },
                    },
                    ...withdrawAction
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let body = alertGlobals.CLAIM_FUNDS_ALERT_DICT.SUCCESS.body.slice(0)
            body = body.replace(alertGlobals.AMOUNT_TEMPLATE, deliverable.requested);
            body = body.replace(alertGlobals.DELIVERABLE_ID_TEMPLATE, deliverable.deliverable_id);
            let alertObj = {
                ...alertGlobals.CLAIM_FUNDS_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
         } catch(e){
            let alertObj = {
                ...alertGlobals.CLAIM_FUNDS_ALERT_DICT.ERROR,
                details: e.message, 
            }
            props.showAlert(alertObj);
            console.log(e);
         }
    }
    function getRecipientActions(){
        if(!props.activeUser){
            return null
        }
        if(!props.proposal){
            return null
        }
        if(!(props.deliverable.recipient === props.activeUser.accountName)){
            return null
        }
        if(props.proposal.status === GLOBAL_VARS.INPROGRESS_KEY){
            if(props.deliverable.status === GLOBAL_VARS.ACCEPTED_KEY){
                return(
                    <button className="btn" onClick={claimFunds}> Claim payment </button>
                )
            }
        }
        return null
    }
    function getReviewerActions(){
        if(!props.activeUser){
            return null
        }
        if(!props.proposal){
            return null
        }
        if(!(props.proposal.reviewer === props.activeUser.accountName)){
            return null
        }
        if(props.proposal.status === GLOBAL_VARS.INPROGRESS_KEY){
            if(props.deliverable.status === GLOBAL_VARS.REPORTED_KEY){
                return (
                    <React.Fragment>  
                        <p>Enter a review link:</p>
                        <input
                            type="text"
                            name="reportLink"
                            placeholder="Enter a review link"
                            value={reviewMemo}
                            onChange={handleReviewMemoChange}
                        />
                        <button className="btn" onClick={() => reviewReport(true)}>Approve report</button>  
                        <button className="btn" onClick={() => reviewReport(false)}>Reject report</button>
                        
                    </React.Fragment>
                )
            }
        }
        return null        
    }

    function getProposerActions(){
        if(!props.activeUser){
            return null
        }
        if(!props.proposal){
            return null
        }
        if(!(props.proposal.proposer === props.activeUser.accountName)){
            return null
        }
        if(props.proposal.status === GLOBAL_VARS.INPROGRESS_KEY){            
            if([GLOBAL_VARS.INPROGRESS_KEY, GLOBAL_VARS.REJECTED_KEY].includes(props.deliverable.status)){
                return (
                    <React.Fragment>
                        <p>Enter the report link:</p>
                        <input
                            type="text"
                            name="reportLink"
                            placeholder="Enter a report link"
                            value={reportLink}
                            onChange={handleReportLinkChange}
                        />
                        <button
                            className="btn"
                            onClick={submitReport}
                        >
                            Submit report
                        </button>
                    </React.Fragment>
                )
            }
            if(props.deliverable.status === GLOBAL_VARS.ACCEPTED_KEY){
                return (
                    <button className="btn" onClick={claimFunds}> Claim payment </button>
                )
            }
        }
        return null;
    }
    let proposerActions = getProposerActions();
    let reviewerActions = getReviewerActions();
    let recipientActions = getRecipientActions();

    return (
        <React.Fragment>
            <div className="single-deliverable--header">
                <h2>#{deliverable.deliverable_id} - {readableStatusName[deliverable.status]}</h2>
            </div>
            <hr />
            <div className="single-deliverable--body">
                <p><strong>Amount requested:</strong> {deliverable.requested}</p>
                <p><strong>Recipient:</strong> {deliverable.recipient}</p>
                <p><strong>Last reviewed:</strong> {deliverable.review_time}</p>
                {
                    deliverable.status_comment ?
                    <a 
                        href={"//" + deliverable.status_comment} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        View review report
                    </a>
                    : ""
                }
                <div>
                    
                </div>
                {
                    deliverable.report ? 
                    <a 
                        href={"//" + deliverable.report} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        View report
                    </a>
                    :   ""
                }
                {
                    proposerActions ?
                    <React.Fragment>
                        <hr/>
                        <div className="single-deliverable--proposer-actions">                            
                            {proposerActions}                            
                        </div>
                    </React.Fragment>
                    // Only show recipient actions, if there are no proposer actions.
                    : recipientActions ?
                        <React.Fragment>
                            <hr/>
                            <div className="single-deliverable--recipient-actions">
                                {recipientActions}
                            </div>
                        </React.Fragment>
                    : ""
                }
                {
                    reviewerActions ?
                    <React.Fragment>
                        <hr/>
                        <div className="single-deliverable--reviewer-actions">
                            {reviewerActions}
                        </div>
                    </React.Fragment>
                    : ""
                }    
            </div>
        </React.Fragment>
    )
}