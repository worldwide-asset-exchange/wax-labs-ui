import React from 'react';
import {
Link
} from 'react-router-dom';

export default function RenderProposalGrid(props){
    const proposal = props.proposal;
    return (
        <Link to={'/proposals/' + proposal.proposal_id} className="proposal-grid-single">
            {proposal.proposal_id}
            {proposal.title}
        </Link>
    );
}