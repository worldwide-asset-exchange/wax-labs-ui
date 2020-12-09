import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import * as globals from '../../utils/vars';
import {requestedAmountToFloat} from '../../utils/util';

const readableStatusName = globals.READABLE_DELIVERABLE_STATUS

export default function RenderSingleDeliverable(props){
    
    const [showReportModal, setShowReportModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reportLink, setReportLink] = useState("");
    const [reviewMemo, setReviewMemo] = useState("");
    const {id} = useParams();

    let deliverable = {...props.deliverable};
    /* Making a copy of the requested_raw */
    deliverable.requested_raw = deliverable.requested.slice();

    deliverable.requested = requestedAmountToFloat(deliverable.requested) + " WAX";

    function toggleShowReportModal(show){
        setShowReportModal(show);
    }
    function toggleShowReviewModal(show){
        setShowReviewModal(show);
    }

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
                        account: globals.LABS_CODE,
                        name: globals.REVIEW_DELIVERABLE_ACTION,
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
            let alertObj = {
                title: "Review report success!",
                body: `Proposal's report was successfuly ${accept ? "accepted" : "rejected"}.`, 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
            toggleShowReviewModal(false);
         } catch(e){
            let alertObj = {
                title: "Review report error!",
                body: `An error ocurred when trying to call the reviewdeliv action.`,
                details: e.message, 
                variant: "danger",
                dismissible: true,
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
                        account: globals.LABS_CODE,
                        name: globals.SUBMIT_REPORT_ACTION,
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
            let alertObj = {
                title: "Submit report success!",
                body: "Proposal's report was updated.", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
            toggleShowReportModal(false);            
         } catch(e){
            let alertObj = {
                title: "Submit report error!",
                body: "An error ocurred when trying to call the submit report action.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
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
                    account: globals.LABS_CODE,
                    name: globals.WITHDRAW_ACTION,
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
                        account: globals.LABS_CODE,
                        name: globals.CLAIM_FUNDS_ACTION,
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
            let alertObj = {
                title: "Claim funds success!",
                body: "Proposal's funds were claimed.", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
         } catch(e){
            let alertObj = {
                title: "Claim funds error!",
                body: "An error occurred when trying to call the claim funds action.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
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
        if(props.proposal.status === globals.INPROGRESS_KEY){
            if(props.deliverable.status === globals.ACCEPTED_KEY){
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
        if(props.proposal.status === globals.INPROGRESS_KEY){
            if(props.deliverable.status === globals.REPORTED_KEY){
                return (
                    <React.Fragment>    
                        <button className="btn" onClick={() => toggleShowReviewModal(true)}>Review report</button>                    
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
        if(props.proposal.status === globals.INPROGRESS_KEY){            
            if([globals.INPROGRESS_KEY, globals.REJECTED_KEY].includes(props.deliverable.status)){
                return (
                    <React.Fragment>
                        <button className="btn" onClick={()=>toggleShowReportModal(true)}> Submit Report </button>                        
                    </React.Fragment>
                )
            }
            if(props.deliverable.status === globals.ACCEPTED_KEY){
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
                <Modal
                    show={showReviewModal}
                    centered='true'
                    onHide={()=>toggleShowReviewModal(false)}
                >
                    <Modal.Body>
                        <h1>Enter a review memo:</h1>
                        <input
                            type="text"
                            name="reportLink"
                            value={reviewMemo}
                            onChange={handleReviewMemoChange}
                        />
                        <button className="btn" onClick={() => reviewReport(false)}>Reject report</button>
                        <button className="btn" onClick={() => reviewReport(true)}>Approve report</button>
                    </Modal.Body>

                </Modal>
                <Modal
                    show={showReportModal}
                    centered='true'
                    onHide={()=>toggleShowReportModal(false)}
                >
                    <Modal.Body>
                        <h1>Enter the report link:</h1>
                        <input
                            type="text"
                            name="reportLink"
                            value={reportLink}
                            onChange={handleReportLinkChange}
                        />
                        <button
                            className="btn"
                            onClick={submitReport}
                        >
                            Submit report
                        </button>
                    </Modal.Body>
                </Modal>
            </div>
        </React.Fragment>
    )
}