import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const readableStatusName = {
    drafting: "Draft",
    reported: "Reported",
    accepted: "Accepted",
    inprogress: "In progress",
    claimed: "Claimed",
    rejected: "Rejected",
}

export default function RenderSingleDeliverable(props){
    let deliverable = props.deliverable;

    /* Getting rid of the .00000000 WAX*/
    deliverable.requested = deliverable.requested.slice(0, -13) + " WAX";

    function getReviewerActions(){
        if(!props.activeUser){
            return null
        }
        if(!props.proposal){
            return null
        }
        // console.log(props.activeUser);
        if(!(props.proposal.reviewer === props.activeUser.accountName)){
            return null
        }
        if(props.proposal.status === "inprogress"){
            if(props.deliverable.status === "reported"){
                return (
                    <React.Fragment>
                        <button className="btn">Reject report</button>
                        <button className="btn">Approve report</button>
                    </React.Fragment>
                )
            }
        }
        return null
        
    }

    function getProposerActions(){

        if(!props.activeUser){
            return null
        }
        if(!props.proposal){
            return null
        }
        // console.log(props.activeUser);
        if(!(props.proposal.proposer === props.activeUser.accountName)){
            return null
        }
        if(props.proposal.status === "inprogress"){
            if(["inprogress", "rejected"].includes(props.deliverable.status)){
                return (
                    <button className="btn"> Submit Report </button>
                )
            }
            if(props.deliverable.status === "accepted"){
                return (
                    <button className="btn"> Claim payment </button>
                )
            }
        }
        return null;
    }
    let proposerActions = getProposerActions();
    let reviewerActions = getReviewerActions();

    return (
        <React.Fragment>
            <div className="single-deliverable--header">
                <h2>#{deliverable.deliverable_id} - {readableStatusName[deliverable.status]}</h2>
            </div>
            <hr />
            <div className="single-deliverable--body">
                <p><strong>Amount requested:</strong> {deliverable.requested}</p>
                <p><strong>Recipient:</strong> {deliverable.recipient}</p>
                <p><strong>Last reviewed:</strong> {deliverable.review_time}</p>
                {
                    deliverable.report ? 
                    <a 
                        href={"//" + deliverable.report} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        View report
                    </a>
                :   ""
                }
                {
                    proposerActions ?
                    <React.Fragment>
                        <hr/>
                        <div className="single-deliverable--proposer-actions">
                            {proposerActions}
                        </div>
                    </React.Fragment>
                    : ""
                }
                {
                    reviewerActions ?
                    <React.Fragment>
                        <hr/>
                        <div className="single-deliverable--reviewer-actions">
                            {reviewerActions}
                        </div>
                    </React.Fragment>
                    : ""
                }
            </div>
        </React.Fragment>
    )
}