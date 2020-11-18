import React from 'react';
import {
Link
} from 'react-router-dom';

export default function RenderProposalGrid(props){
    const proposal = props.proposal;

    function RenderReadableStatus() {
        if (proposal.status){
            if (proposal.status === "drafting"){
                return <span>Draft</span>
            } else if (proposal.status === "submitted") {
                return <span>In Review</span>
            } else if (proposal.status === "approved") {
                return <span>Approved</span>
            } else if (proposal.status === "voting") {
                return <span>In Vote</span>
            } else if (proposal.status === "completed") {
                return <span>Complete</span>
            } else if (proposal.status === "cancelled") {
                return <span>Cancelled</span>
            } else if (proposal.status === "inprogress") { 
                return <span>In Progress</span>
            } else {
                return null
            }
        } else {
            return null;
        }
    }

    const readableAmount = proposal.total_requested_funds.slice(0,-13) + ' WAX';

    return (
        <Link to={'/proposals/' + proposal.proposal_id} className="proposal-grid-single">
            <div className="image">
                <img src="https://via.placeholder.com/245x90?text=Cover+Image"  />
            </div>
            <div className="body">
                <div className="title">
                    <h3>{proposal.title} <span className="proposal-id">(#{proposal.proposal_id})</span></h3>
                    <div className="description"><em>{proposal.description}</em></div>
                </div>
                <div className="row">
                    <div className="cell"><strong>Status:</strong> <RenderReadableStatus /></div>
                    <div className="cell"><strong>Category:</strong> <span className="category">{proposal.category}</span></div>
                </div>
                <div className="row">
                    <div className="cell"><strong>Proposer:</strong> {proposal.proposer}</div>
                    <div className="cell"><strong>Requested Amount:</strong> {readableAmount}</div>
                </div>
                <div className="row">
                    <div className="cell"><strong>Deliverables:</strong> {proposal.deliverables}</div>
                </div>
            </div>
        </Link>
    );
}