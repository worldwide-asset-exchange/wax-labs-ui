import React from 'react';
import {
Link
} from 'react-router-dom';


export default function RenderDeliverableGrid(props){
    const deliverable = props.deliverable;
    
    return (
        <div className="proposal-grid-single">
            <div className="information">
                Proposal: <Link to={"/proposals/" + deliverable.proposal_id}>{deliverable.proposal_title}</Link>
                Deliverable: {deliverable.deliverable_id_readable}
                {deliverable.description}
                <a href={deliverable.report} target="_blank">View Deliverable</a>
            </div>
            <div className="actions">
                <button className="btn" onClick={props.approveDeliverable}>Approve</button>
                <button className="btn" onClick={props.rejectDeliverable}>Reject</button>
                <Link className="btn" to={"/proposals/"+ deliverable.proposal_id}>View Proposal</Link>
            </div>
        </div>
    );
}