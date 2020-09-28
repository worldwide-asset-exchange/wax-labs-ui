import React from 'react';
import {
Link
} from 'react-router-dom';

function RenderProposalGrid(props){
    return (
        <Link key={props.proposal_id} to={'/proposals/' + props.proposal_id} className="proposal-grid-single">
            Proposal
        </Link>
    );
}

export default RenderProposalGrid;