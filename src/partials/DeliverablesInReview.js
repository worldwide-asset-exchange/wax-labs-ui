import React from 'react';

import RenderDeliverableGrid from './DeliverableGridSingle.js';

export default function RenderDevliverablesInReview(props) {

    if (!props.deliverables){
        console.log(props.deliverables);
        return (
            <div className="filtered-proposals archived">
                <h3>Deliverables In Review</h3>
                <p>There are currently no deliverables to review.</p>
            </div>
        );
    } else {
        console.log(props.deliverables)
        return (
            <div className="filtered-proposals archived">
                <h3>All Deliverables</h3>
                {props.deliverables.map((deliverable) =>
                <RenderDeliverableGrid deliverable={deliverable} activeUser={props.activeUser} key={deliverable.deliverable_id} />)}
            </div>
        );
    }
}