import React from 'react';

import RenderDeliverableGrid from './DeliverableGridSingle.js';

export default function RenderDevliverablesInReview(props) {

    if (!props.deliverables){
        console.log(props.deliverables);
        return (
            <div className="filtered-proposals archived">
                <h2>Deliverables In Review</h2>
                <p>There are currently no deliverables to review.</p>
            </div>
        );
    } else {
        console.log(props.deliverables)
        return (
            <div className="filtered-proposals archived">
                <h2>Deliverables In Review</h2>
                {props.deliverables.map((deliverable) =>
                <RenderDeliverableGrid deliverable={deliverable} key={deliverable.deliverable_id} />)}
            </div>
        );
    }
}