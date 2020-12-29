import React, {useState}from 'react';
import {useParams} from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import * as globals from "../../utils/vars";
import * as alertGlobals from '../../utils/alerts';

export default function RenderAdminMenu(props){
    const [showReviewerModal, setShowReviewerModal] = useState(false);
    const [reviewerAccountName, setReviwerAccountName] = useState("");
    const { id } = useParams();

    function toggleShowReviewerModal(show){
        setShowReviewerModal(show);
    }
    function handleReviewerChange(event){
        setReviwerAccountName(event.target.value);
    }

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

    async function reviewProposal(approve) {
        let activeUser = props.activeUser;
        try {      
            await activeUser.signTransaction({
                actions: [
                    {
                        account: globals.LABS_CONTRACT_ACCOUNT,
                        name: globals.REVIEW_PROPOSAL_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                            approve: approve,
                            memo: ''
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let alertObj = {
                ...alertGlobals.REVIEW_PROP_ALERT_DICT.SUCCESS,
                body: alertGlobals.REVIEW_PROP_ALERT_DICT.SUCCESS.body.slice().replace(alertGlobals.APPROVE_TEMPLATE, approve ? "aproved" : "rejected")
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch(e) {
            let alertObj = {
                ...alertGlobals.REVIEW_PROP_ALERT_DICT.ERROR,
                details: e.message,

            }
            props.showAlert(alertObj);
            console.log(e);
        }
    }
    async function deleteProposal() {
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
    async function setReviewer(deliverable){
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: globals.LABS_CONTRACT_ACCOUNT,
                        name: globals.SET_REVIEWER_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposal_id: id,
                            deliverable_id: 1,
                            // reviewer should be a state.
                            new_reviewer: reviewerAccountName,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let body = alertGlobals.SET_REVIEWER_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace("%reviewer_name%", reviewerAccountName);
            body = body.replace("%proposal_id%", id);
            let alertObj = {
                ...alertGlobals.SET_REVIEWER_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
         } catch(e){
            let alertObj = {
                ...alertGlobals.SET_REVIEWER_ALERT_DICT.ERROR,
                details: e.message, 
            }
            props.showAlert(alertObj);
            console.log(e);
         }
    }

    function renderOptions(){
        if(props.proposal.status === globals.DRAFTING_KEY){         
            return(
                <button className="btn" onClick={cancelProposal}>Cancel proposal</button>
            )   
        }
        else if(props.proposal.status === globals.SUBMITTED_KEY){
            console.log(props.proposal);
            return (
                <React.Fragment>
                    <button className="btn" onClick={()=>toggleShowReviewerModal(true)}>{`${props.proposal.reviewer ? "Update" : "Set"}`} reviewer</button>
                    <button className="btn" onClick={()=>reviewProposal(true)}>Approve proposal</button>
                    <button className="btn" onClick={()=>reviewProposal(false)}>Reject proposal</button>
                    <button className="btn" onClick={cancelProposal}>Cancel proposal</button>
                </React.Fragment>
            )            
        }
        else if([globals.APPROVED_KEY, globals.VOTING_KEY].includes(props.proposal.status)){
            return ( 
                <React.Fragment>
                    <button className="btn" onClick={()=>toggleShowReviewerModal(true)}>{`${props.proposal.reviewer ? "Update" : "Set"}`}  reviewer</button>               
                    <button className="btn" onClick={cancelProposal}>Cancel proposal</button>
                </React.Fragment>
            )
        }
        else if(props.proposal.status === globals.PROPOSAL_INPROGRESS_KEY){
            return(
                <button className="btn" onClick={()=>toggleShowReviewerModal(true)}>{`${props.proposal.reviewer ? "Update" : "Set"}`}  reviewer</button>
            )
        }
        
        else if([globals.CANCELLED_KEY, globals.FAILED_KEY, globals.COMPLETED_KEY].includes(props.proposal.status)){
            return (
                <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
            )
        }
        return ""
    }

    if(props.isAdmin){
        return(
            <div className="admin-menu">
                <h3>Admin menu</h3>
                {renderOptions()}
                <Modal
                    show={showReviewerModal} 
                    centered='true' 
                    onHide={()=>toggleShowReviewerModal(false)}
                >
                    <Modal.Body>
                        <h1>Set the reviewer account name:</h1>
                        <input
                            type="text"
                            name="reviewer"
                            value={reviewerAccountName}
                            maxLength="12"
                            onChange={handleReviewerChange}
                        />
                        <button
                            className="btn"
                            onClick={setReviewer}
                        >
                            Set reviewer
                        </button>
                    </Modal.Body>
                </Modal>
            </div>       
        )
    }
    return null

}