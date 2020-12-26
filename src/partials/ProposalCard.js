import React, {useState} from 'react';
import {
Link
} from 'react-router-dom';

import * as globals from "../utils/vars"
import './ProposalCard.scss'

function tagStyle(proposalState) {
    let tagClass;
    switch(proposalState) {
        case globals.FAILED_KEY:
        case globals.CANCELLED_KEY:
            tagClass='tag--negative';
            break;
        case globals.VOTING_KEY:
        case globals.PROPOSAL_INPROGRESS_KEY:
            tagClass='tag--attention';
            break;
        case globals.APPROVED_KEY:
        case globals.COMPLETED_KEY:
            tagClass='tag--positive';
            break;
        default:
            tagClass='tag--neutral';
    }
    return tagClass;
}

export default function RenderProposalCard(props){
    const [imgError, setImgError] = useState(false);

    const proposal = props.proposal;
    const readableAmount = proposal.total_requested_funds.slice(0,-13) + ' WAX';

    return (
        <Link
            to={'/proposals/' + proposal.proposal_id}
            className="proposalCard"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),
                                    url(${imgError ? globals.DEFAULT_PROPOSAL_IMAGE_URL : proposal.image_url})`
            }}>
            <img onError={()=>{setImgError(true);}}
                src={proposal.image_url}
                style={{display: 'none'}}
                alt=""/>
            <div className="proposalCard__content"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),
                                        url(${imgError ? globals.DEFAULT_PROPOSAL_IMAGE_URL : proposal.image_url})`
                }}>
                <div>
                    <div className="proposalCard__id">#{proposal.proposal_id}</div>
                    <h3 className="proposalCard__title">{proposal.title}</h3>
                    <div className="proposalCard__description"><em>{proposal.description}</em></div>
                </div>

                <div className="proposalCard__details">
                    <div>
                        <div className="proposalCard__label">Proposer</div>
                        <div className="proposalCard__author">{proposal.proposer}</div>
                    </div>
                    <div>
                        <div className="proposalCard__label">Requested amount</div>
                        <div className="proposalCard__requestedAmount">{readableAmount}</div>
                    </div>
                </div>
            </div>
            <div className="proposalCard__status">
                <div className={`tag ${tagStyle(proposal.status)}`}>{globals.READABLE_PROPOSAL_STATUS[proposal.status]}</div>
                <div className="proposalCard__deliverablesAmount">{proposal.deliverables}{proposal.deliverables === 1 ? " deliverable" : " deliverables" }
                </div>
                <div className="tag tag--category">{proposal.category}</div>
            </div>
        </Link>
    );
}