import React from 'react';
import {
Routes,
Route,
Link
} from 'react-router-dom';

import RenderDeliverablesInReview from '../partials/DeliverablesInReview.js';
import RenderAssignedDeliverables from '../partials/AssignedDeliverables.js';

export default function RenderDeliverables(props) {
    return (
        <div className="deliverables">
            <div className="deliverables-menu">
                <h3>Active Proposals</h3>
                <ul>
                    <li><Link to="/deliverables">Deliverables</Link></li>
                    <li><Link to="assigned">Assigned to Me</Link></li>
                </ul>
            </div>
            <div className="deliverables-body">
                <Routes>
                    {props.activeUser ?
                    <>
                    <Route path="/" activeUser={props.activeUser} element={<RenderDeliverablesInReview activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path="assigned" activeUser={props.activeUser} element={<RenderAssignedDeliverables activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    </>
                    :
                    <>
                    <Route path="/" element={<RenderDeliverablesInReview activeUser="" isAdmin={props.isAdmin} />} />
                    <Route path="assigned" element={<RenderAssignedDeliverables  activeUser="" isAdmin={props.isAdmin} />} />
                    </>
                    }
                </Routes>
            </div>
        </div>
    );
}