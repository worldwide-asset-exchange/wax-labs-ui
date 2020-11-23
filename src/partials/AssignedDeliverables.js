import React from 'react';
import { Link } from 'react-router-dom';

import RenderDeliverableGrid from './DeliverableGridSingle.js';

export default function RenderAssignedDevliverables(props) {

    function RenderBreadcrumbs() {
        if (props.from_admin === "true") {
            return <Link to="/admin">{'< Back to Admin'}</Link>
        } else {
            return null;
        }
    }

    if (!props.deliverables || !props.activeUser) {
        return (
            <div className="deliverables-body">
                <RenderBreadcrumbs />
                <h2>Deliverables</h2>
                <div className="deliverables-menu">
                    <ul>
                        <li><Link to="/deliverables" className={props.status === "all" ? "current-page btn" : "btn" }>Deliverables</Link></li>
                        <li><Link to="/deliverables/assigned" className={props.status === "assigned" ? "current-page btn" : "btn" }>Assigned to Me</Link></li>
                    </ul>
                </div>
                <div className="filtered-deliverables">
                    <h3>Assigned Deliverables to Review</h3>
                    <p>There are currently no deliverables to review.</p>
                </div>
            </div>
        );
    } else {
        console.log(props.deliverables);
        return (
            <div className="deliverables-body">
                <RenderBreadcrumbs />
                <h2>Deliverables</h2>
                <div className="deliverables-menu">
                    <ul>
                        <li><Link to="/deliverables" className={props.status === "all" ? "current-page btn" : "btn" }>Deliverables</Link></li>
                        <li><Link to="/deliverables/assigned" className={props.status === "assigned" ? "current-page btn" : "btn" }>Assigned to Me</Link></li>
                    </ul>
                </div>
                <div className="filtered-deliverables">
                    <h3>Assigned to Me</h3>
                    {props.deliverables.filter(x => x.reviewer === props.activeUser.accountName).map((deliverable) =>
                    <RenderDeliverableGrid deliverable={deliverable} activeUser={props.activeUser} key={deliverable.deliverable_id} />)}
                </div>
            </div>
        );
    }
}