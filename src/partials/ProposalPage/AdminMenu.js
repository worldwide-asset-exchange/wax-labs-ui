import React, {useState}from 'react';
import {useParams} from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import * as globals from "../../utils/vars"

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
                title: "Cancel proposal error!",
                body: "Cancel proposal encountered an error.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
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
                title: "Review proposal success!",
                body: "Proposal was reviewed.", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch(e) {
            let alertObj = {
                title: "Review proposal error!",
                body: "An error ocurred when trying to call the review proposal action.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
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
            let alertObj = {
                title: "Set reviewer success!",
                body: "Proposal's reviewer was updated.", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();
         } catch(e){
            let alertObj = {
                title: "Set reviewer error!",
                body: "An error ocurred when trying to call the set reviewer action.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
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
            return (
                <React.Fragment>
                    <button className="btn" onClick={()=>toggleShowReviewerModal(true)}>Set reviewer</button>
                    <button className="btn" onClick={()=>reviewProposal(true)}>Approve proposal</button>
                    <button className="btn" onClick={()=>reviewProposal(false)}>Reject proposal</button>
                    <button className="btn" onClick={cancelProposal}>Cancel proposal</button>
                </React.Fragment>
            )            
        }
        else if([globals.APPROVED_KEY, globals.VOTING_KEY].includes(props.proposal.status)){
            return ( 
                <React.Fragment>
                    <button className="btn" onClick={()=>toggleShowReviewerModal(true)}>Set reviewer</button>               
                    <button className="btn" onClick={cancelProposal}>Cancel proposal</button>
                </React.Fragment>
            )
        }
        else if(props.proposal.status === globals.INPROGRESS_KEY){
            return(
                <button className="btn" onClick={()=>toggleShowReviewerModal(true)}>Set reviewer</button>
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