import React, {useState} from 'react';
import {useParams} from 'react-router-dom';

import * as GLOBAL_VARS from '../../utils/vars';
import * as alertGlobals from "../../utils/alerts";
import {requestedAmountToFloat, tagStyle} from '../../utils/util';

import arrow from '../../images/orange-arrow.svg'
import './SingleDeliverable.scss'
import { Accordion } from 'react-bootstrap';

const readableStatusName = GLOBAL_VARS.READABLE_DELIVERABLE_STATUS

export default function RenderSingleDeliverable(props){

    const [reportLink, setReportLink] = useState("");
    const [reviewMemo, setReviewMemo] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
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
    function updateAccordionState() {
        if (isAccordionOpen) {
            setIsAccordionOpen(false)
        } else {
            setIsAccordionOpen(true)
        }
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
        if(props.proposal.status === GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY){
            if(props.deliverable.status === GLOBAL_VARS.ACCEPTED_KEY){
                return(
                    <button className="button button--secondary" onClick={claimFunds}> Claim payment </button>
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
        if(props.proposal.status === GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY){
            if(props.deliverable.status === GLOBAL_VARS.REPORTED_KEY){
                return (
                    <React.Fragment>
                        <p className="input__label">Enter a review link:</p>
                        <input
                            type="text"
                            name="reportLink"
                            placeholder="Enter a review link"
                            value={reviewMemo}
                            onChange={handleReviewMemoChange}
                            className="input"
                        />
                        <button className="button button--approval" onClick={() => reviewReport(true)}>Approve report</button>
                        <button className="button button--rejection" onClick={() => reviewReport(false)}>Reject report</button>
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
        if(props.proposal.status === GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY){
            if([GLOBAL_VARS.DELIVERABLE_INPROGRESS_KEY, GLOBAL_VARS.REJECTED_KEY].includes(props.deliverable.status)){
                return (
                    <React.Fragment>
                        <p className="input__label">Enter the report link:</p>
                        <input
                            type="text"
                            name="reportLink"
                            placeholder="Enter a report link"
                            value={reportLink}
                            onChange={handleReportLinkChange}
                            className="input"
                        />
                        <button
                            className="button button--secondary"
                            onClick={submitReport}
                        >
                            Submit report
                        </button>
                    </React.Fragment>
                )
            }
            if(props.deliverable.status === GLOBAL_VARS.ACCEPTED_KEY){
                return (
                    <button className="button button--secondary" onClick={claimFunds}> Claim payment </button>
                )
            }
        }
        return null;
    }
    let proposerActions = getProposerActions();
    let reviewerActions = getReviewerActions();
    let recipientActions = getRecipientActions();
    console.log(deliverable);
    return (
        <div className="singleDeliverable">
            <Accordion>
                <Accordion.Toggle as="div" eventKey="0" onClick={updateAccordionState}>
                    <div className="singleDeliverable__header">
                        <h3 className="singleDeliverable__id">#{deliverable.deliverable_id}</h3>
                        <div className={`tag ${tagStyle(deliverable.status, true)}`}>{readableStatusName[deliverable.status]}</div>
                        <div className="singleDeliverable__detail singleDeliverable__detail--main">
                            <div className="singleDeliverable__label">Amount requested</div>
                            <div className="singleDeliverable__info">{deliverable.requested}</div>
                        </div>
                        <img className={`singleDeliverable__arrow ${isAccordionOpen ? "singleDeliverable__arrow--up" : ""}`} src={arrow} alt="Arrow indicating this is an accordion"/>
                    </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <div className="singleDeliverable__body">
                        <div className="singleDeliverable__informationGroup">
                            <div className="singleDeliverable__detail">
                                <div className="singleDeliverable__label">Recipient</div>
                                <div className="singleDeliverable__info">{deliverable.recipient}</div>
                            </div>
                            <div className="singleDeliverable__detail">
                                <div className="singleDeliverable__label">Last reviewed</div>
                                <div className="singleDeliverable__info">{deliverable.review_time}</div>
                            </div>
                            {
                                deliverable.status_comment ?
                                <a
                                    href={"//" + deliverable.status_comment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inlineLink"
                                >
                                    View rejection report
                                </a>
                                : ""
                            }
                            {
                                deliverable.report ?
                                <a
                                    href={"//" + deliverable.report}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inlineLink"
                                >
                                    View completion report
                                </a>
                                :   ""
                            }
                        </div>
                        {
                            proposerActions ?
                            <React.Fragment>
                                <hr/>
                                <div className="singleDeliverable__actions">
                                    {proposerActions}
                                </div>
                            </React.Fragment>
                            // Only show recipient actions, if there are no proposer actions.
                            : recipientActions ?
                                <React.Fragment>
                                    <hr/>
                                    <div className="singleDeliverable__actions">
                                        {recipientActions}
                                    </div>
                                </React.Fragment>
                            : ""
                        }
                        {
                            reviewerActions ?
                            <React.Fragment>
                                <hr/>
                                <div className="singleDeliverable__actions">
                                    {reviewerActions}
                                </div>
                            </React.Fragment>
                            : ""
                        }
                   </div>
                </Accordion.Collapse>
            </Accordion>
        </div>
    )
}