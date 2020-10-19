import React from 'react';

import * as waxjs from "@waxio/waxjs/dist";




export default function RenderReviewMilestones() {
const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

    return (
        <div className="filtered-proposals review-milestones">
            <h2>Review Milestones</h2>
        </div>
    );
}