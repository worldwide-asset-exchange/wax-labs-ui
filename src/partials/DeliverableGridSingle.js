import React from 'react';
import {
Link
} from 'react-router-dom';


export default function RenderDeliverableGrid(props){
    const deliverable = props.deliverable;
    
    return (
        <div className="proposal-grid-single">
            Proposal ID: {deliverable.proposal_id}
            Title: {deliverable.proposal_title}
            Deliverable ID: {deliverable.deliverable_id_readable}
            <a href={deliverable.report} target="_blank">{deliverable.report}</a>
            <button className="btn" onClick={props.approveDeliverable}>Approve</button>
            <button className="btn" onClick={props.rejectDeliverable}>Reject</button>
            <Link className="btn" to={"/proposals/"+ deliverable.proposal_id}>View Proposal</Link>
        </div>
    );
}