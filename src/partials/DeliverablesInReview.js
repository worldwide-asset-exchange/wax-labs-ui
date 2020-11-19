import React from 'react';
import { Link } from 'react-router-dom';

import RenderDeliverableGrid from './DeliverableGridSingle.js';

export default function RenderDevliverablesInReview(props) {

    if (!props.deliverables){
        console.log('no delivs');
        return (
            <div className="deliverables-body">
                <div className="deliverables-menu">
                    <ul>
                        <li><Link to="/deliverables" className={props.status === "all" ? "current-page btn" : "btn" }>Deliverables</Link></li>
                        <li><Link to="assigned" className={props.status === "assigned" ? "current-page btn" : "btn" }>Assigned to Me</Link></li>
                    </ul>
                </div>
                <div className="filtered-deliverables">
                    <h3>Deliverables In Review</h3>
                    <p>There are currently no deliverables to review.</p>
                </div>
            </div>
        );
    } else {
        console.log(props.deliverables)
        return (
            <div className="deliverables-body">
                <div className="deliverables-menu">
                    <ul>
                        <li><Link to="/deliverables" className={props.status === "all" ? "current-page btn" : "btn" }>Deliverables</Link></li>
                        <li><Link to="assigned" className={props.status === "assigned" ? "current-page btn" : "btn" }>Assigned to Me</Link></li>
                    </ul>
                </div>
                <div className="filtered-deliverables">
                    <h3>All Deliverables</h3>
                    {props.deliverables.map((deliverable) =>
                    <RenderDeliverableGrid deliverable={deliverable} activeUser={props.activeUser} key={deliverable.deliverable_id} />)}
                </div>
            </div>
        );
    }
}