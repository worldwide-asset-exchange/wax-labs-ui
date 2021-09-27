import React, {useState} from 'react';
import {
Link
} from 'react-router-dom';

import moment from 'moment';

import * as globals from "../utils/vars"
import {tagStyle} from "../utils/util"
import './ProposalCard.scss'

function votingInformation(votingEndsIn) {
    if (votingEndsIn.includes('ago')) {
        return (<p className="proposalCard__votingEnd">Voting ended {votingEndsIn}</p>)
    } else {
        return (<p className="proposalCard__votingEnd">Voting will end {votingEndsIn}</p>)
    }
}

export default function RenderProposalCard(props){
    const [imgError, setImgError] = useState(false);



    const proposal = props.proposal;
    const hideStatus = props.hideStatus ? props.hideStatus : false;
    const readableAmount = proposal.total_requested_funds.split(".")[0] + " " + proposal.total_requested_funds.split(" ")[1];

    const votingEndsIn = moment(proposal.vote_end_time, "YYYY-MM-DDTHH:mm:ss[Z]").parseZone().fromNow();
    // Leaving this here because I expect it to be used soon. - JS
    // const readableEndTime = moment(proposal.vote_end_time).format("MMMM Do, YYYY [at] h:mm:ss a [UTC]");


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
            {
                hideStatus ?
                ""
                :
                <div className="proposalCard__status">
                    <div className={`tag ${tagStyle(proposal.status)}`}>{globals.READABLE_PROPOSAL_STATUS[proposal.status]}</div>
                    {proposal.status === globals.VOTING_KEY ? <div>{votingInformation(votingEndsIn)}</div> : ""}
                    <div className="proposalCard__deliverablesAmount">
                        {proposal.deliverables}{proposal.deliverables === 1 ? " deliverable" : " deliverables" }
                    </div>
                    <div className="tag tag--category">{props.categories[proposal.category]}</div>
                </div>
            }
        </Link>
    );
}