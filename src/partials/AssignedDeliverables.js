import React from 'react';

import RenderDeliverableGrid from './DeliverableGridSingle.js';

export default function RenderAssignedDevliverables(props) {

    if (!props.deliverables || !props.activeUser) {
        return (
            <div className="filtered-proposals archived">
                <h3>Assigned Deliverables to Review</h3>
                <p>There are currently no deliverables to review.</p>
            </div>
        );
    } else {
        console.log(props.deliverables);
        return (
            <div className="filtered-proposals archived">
                <h3>Assigned to Me</h3>
                {props.deliverables.filter(x => x.reviewer === props.activeUser.accountName).map((deliverable) =>
                <RenderDeliverableGrid deliverable={deliverable} activeUser={props.activeUser} key={deliverable.deliverable_id} />)}
            </div>
        );
    }
}