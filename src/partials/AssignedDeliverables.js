import React from 'react';

import RenderDeliverableGrid from './DeliverableGridSingle.js';

export default function RenderAssignedDevliverables(props) {

    if (!props.deliverables || !props.activeUser) {
        return (
            <div className="filtered-proposals archived">
                <h2>Assigned Deliverables to Review</h2>
                <p>There are currently no deliverables to review.</p>
            </div>
        );
    } else {
        console.log(props.deliverables);
        return (
            <div className="filtered-proposals archived">
                <h2>Assigned Deliverables to Review</h2>
                {props.deliverables.filter(x => x.reviewer === props.activeUser.accountName).map((deliverable) =>
                <RenderDeliverableGrid deliverable={deliverable} key={deliverable.deliverable_id} />)}
            </div>
        );
    }
}