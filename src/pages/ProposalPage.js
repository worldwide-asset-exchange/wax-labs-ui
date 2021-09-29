import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Link, useParams} from 'react-router-dom';

import * as waxjs from "@waxio/waxjs/dist";

import {sleep, requestedAmountToFloat, tagStyle} from "../utils/util";
import * as GLOBAL_VARS from '../utils/vars';
import RenderProposerMenu from '../partials/ProposalPage/ProposerMenu';
import RenderAlerts from '../partials/Alerts/Alerts';
import RenderLoadingPage from '../partials/LoadingPage';
import RenderVotesDisplay from '../partials/ProposalPage/VotesDisplay';
import RenderDeliverablesList from '../partials/ProposalPage/DeliverablesList';
import RenderAdminMenu from '../partials/ProposalPage/AdminMenu';
import RenderErrorPage from './ErrorPage';

import './ProposalPage.scss';

const wax = new waxjs.WaxJS({ rpcEndpoint: process.env.REACT_APP_WAX_RPC ,  tryAutoLogin: false });

const readableProposalStatus = GLOBAL_VARS.READABLE_PROPOSAL_STATUS;


export default function RenderProposalPage(props){
    const {id} = useParams();
    const [proposal, setProposal] = useState(null);
    const [alertList, setAlertList] = useState([]);
    const [endTime, setEndTime] = useState(null);
    const [votes, setVotes] = useState({});
    const [proposalQueryCount, setProposalQueryCount] = useState(1);
    const [body, setBody] = useState(null);
    const [proposalDeleted, setProposalDeleted] = useState(false);
    const [queryingProposal, setQueryingProposal] = useState(true);
    const [errorImage, setErrorImage] = useState(false);
    const [statusComment, setStatusComment] = useState(false);
    const [voteSupply, setVoteSupply] = useState(0);
    const [passing, setPassing] = useState(false);
    
    const votingEndsIn = moment(endTime, "YYYY-MM-DDTHH:mm:ss[Z]").parseZone().fromNow();
    const readableEndTime = moment(endTime).format("MMMM Do, YYYY [at] h:mm:ss a [UTC]");

    useEffect(() => {
        props.loadWaxUsdPrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    function updateProposalDeleted(boolean){
        setProposalDeleted(boolean);
    }


    function RenderProposalInfo(){
        /*
            Render title
            Render category
            Render status
            Render reviewer
            Render proposer
            Render requested funds
            Render description
            Render VotesDisplay
        */
        return (
            <div className="proposalPage__content">
                <img
                    src={errorImage ? GLOBAL_VARS.DEFAULT_PROPOSAL_IMAGE_URL : proposal.image_url}
                    alt="Chosen by the proposer"
                    className="proposalPage__image"
                    onError={()=>setErrorImage(true)}
                />
                <div className="proposalPage__row">
                    <div className="proposalPage__column">
                            <h1>{proposal.title}</h1>
                            <p className="proposalPage__paragraph--bold">{proposal.description}</p>
                            <p>{body}</p>
                            <p className="proposalPage__label">Financial Roadmap</p>
                            <p>{proposal.road_map}</p>
                    </div>
                    <div className="proposalPage__column">
                        <div className="proposalPage__status">
                            <div className="proposalPage__details">
                                <div className="proposalPage__label proposalPage__label--center">Category</div>
                            <div className="tag tag--category">{props.categories[proposal.category]}</div>
                            </div>
                            <div className="proposalPage__details">
                                <div className="proposalPage__label proposalPage__label--center">Status</div>
                            <div className={`tag ${tagStyle(proposal.status)} proposalPage__statusTag`}>
                                {readableProposalStatus[proposal.status]}
                            </div>
                            {/* check if there is a status comment */}
                                {statusComment ? (
                                <div>
                                    <label>Status comment</label>
                                    <p>{statusComment}</p>
                                </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <RenderVotesDisplay
                                proposal={proposal}
                                votes={votes}
                                activeUser={props.activeUser}
                                endTime={readableEndTime}
                                votingEndsIn={votingEndsIn}
                                updateVotes={updateVotes}
                                updateEndTime={updateEndTime}
                                showAlert={showAlert}
                                rerunProposalQuery={rerunProposalQuery}
                                showActionButtons={true}
                                loginModal={props.loginModal}
                                passing={passing}
                            />
                            <div className="proposalPage__proposalDetails">
                                <div className="proposalPage__details">
                                    <div className="proposalPage__label">Proposer</div>
                                    <Link className="proposalPage__accountID proposalPage__accountID--link"
                                            to={GLOBAL_VARS.PROFILE_LINK + '/' + proposal.proposer}>{proposal.proposer}</Link>
                                </div>
                                {
                                    proposal.reviewer ?
                                        <div className="proposalPage__details">
                                            <div className="proposalPage__label">Reviewer</div>
                                            <div className="proposalPage__accountID">{proposal.reviewer}</div>
                                        </div>
                                        :
                                        ""
                                }
                                <div className="proposalPage__details">
                                    <div className="proposalPage__label">Total Requested Funds</div>
                                    <div className="proposalPage__amount">
                                        {requestedAmountToFloat(proposal.total_requested_funds)
                                        + " " + proposal.total_requested_funds.split(" ")[1]}
                                    </div>
                                </div>
                                {Number(requestedAmountToFloat(proposal.remaining_funds)) > 0 &&
                                    requestedAmountToFloat(proposal.remaining_funds) !== requestedAmountToFloat(proposal.total_requested_funds) ?
                                    <div className="proposalPage__details">
                                        <div className="proposalPage__label">Remaining Funds</div>
                                        <div className="proposalPage__amount">
                                             {requestedAmountToFloat(proposal.remaining_funds)
                                            + " " + proposal.remaining_funds.split(" ")[1]}
                                        </div>
                                    </div>
                                    : null}
                                {proposal.total_paid_funds ?
                                    <div className="proposalPage__details">
                                        <div className="proposalPage__label">Total Claimed Funds</div>
                                        <div className="proposalPage__amount">{requestedAmountToFloat(proposal.total_paid_funds) + " " + proposal.total_paid_funds.split(" ")[1]}</div>
                                    </div>
                                 : null}
                                {proposal.to_be_paid_funds && requestedAmountToFloat(proposal.to_be_paid_funds) > 0 ?
                                    <div className="proposalPage__details">
                                        <div className="proposalPage__label">To be claimed Funds</div>
                                        <div className="proposalPage__amount">{requestedAmountToFloat(proposal.to_be_paid_funds) + " " + proposal.to_be_paid_funds.split(" ")[1]}</div>
                                    </div>
                                : null}
                            </div>
                            </div>
                    </div>
                </div>
            </div>
       )
    }
    useEffect(()=>{
        // console.log(votes);
        if(voteSupply && votes){
            // console.log("I have both", votes, voteSupply);
            if((votes.yes > votes.no)&&((votes.yes + votes.no) >= (voteSupply / 10))){
                setPassing(true);
            } else {
                setPassing(false);
            }
        }
    }, [voteSupply, votes]);
    useEffect(()=>{
        async function getProposalData(){

            setQueryingProposal(true);
            try{
                /* Getting Proposal info */
                let resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    table: GLOBAL_VARS.PROPOSALS_TABLE,
                    json: true,
                    lower_bound: id,
                    upper_bound: id,
                });
                let responseProposal = resp.rows[0]
                if( responseProposal){
                    responseProposal.total_requested_funds = requestedAmountToFloat(responseProposal.total_requested_funds, responseProposal.total_requested_funds.split(" ")[1])
                        + ' ' + responseProposal.total_requested_funds.split(" ")[1];
                }
                setProposal(responseProposal);

            } catch (e){
                console.log(e);
            }
            setQueryingProposal(false);
        }

        async function getContentData(){
            try{
                /* Getting Proposal info */
                let resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    table: GLOBAL_VARS.MD_BODIES_TABLE,
                    json: true,
                    lower_bound: id,
                    upper_bound: id,
                });
                let responseBody = resp.rows[0].content
                setBody(responseBody);

            } catch (e){
                console.log(e);
            }
        }

        async function getTreasuryData() {
            try{
                let resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.DECIDE_CONTRACT_ACCOUNT,
                    scope: GLOBAL_VARS.DECIDE_CONTRACT_ACCOUNT,
                    table: GLOBAL_VARS.TREASURIES_TABLE,
                    json: true,
                });

                setVoteSupply(requestedAmountToFloat(resp.rows[0].supply));
            } catch(e){
                console.log(e);
            }
        }

        async function getStatusCommentData() {
            try{
                /* Getting Proposal info */
                let resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    table: GLOBAL_VARS.PROPOSAL_COMMENTS_TABLE,
                    json: true,
                    lower_bound: id,
                    upper_bound: id,
                });
                let statusComment = null;
                if(resp.rows[0]){
                    statusComment = resp.rows[0].status_comment
                }
                setStatusComment(statusComment);

            } catch (e){
                console.log(e);
            }
        }

        getProposalData();
        getContentData();
        getStatusCommentData();
        getTreasuryData();
        //eslint-disable-next-line
    },[id, proposalQueryCount])

    async function rerunProposalQuery(){
        // Wait 600 miliseconds before repulling data from the chain
        // to avoid getting unupdated state.
        await sleep(600);
        setProposalQueryCount(proposalQueryCount + 1);
    }
    function showAlert(alertObj){
        // Make a copy.
        let alerts = alertList.slice(0);
        // Push new alert to the copied list
        alerts.push(alertObj);
        // Update the list.
        setAlertList(alerts);
    }
    function removeAlert(index){
        // Make a copy.
        let alerts = alertList.slice(0);
        // remove alert at index.
        alerts.splice(index,1);
        // Update the list.
        setAlertList(alerts);
    }
    function updateVotes(voteObj){
        setVotes(voteObj);
    }
    function updateEndTime(endTimeString){
        setEndTime(endTimeString);
    }

    if(proposalDeleted){
        return (
            <div className="proposalPage">
                <RenderAlerts
                    alertList={alertList}
                    removeAlert={removeAlert}
                />
                <h1>This proposal has been successfully deleted</h1>
            </div>
        )
    }
    if(queryingProposal || !props.minRequested || !props.waxUsdPrice || props.queryingAvailableFunds){
        return <RenderLoadingPage />
    }
    if(!proposal){
        return <RenderErrorPage />
    }
    return (
        <div className="proposalPage">
            <RenderAlerts
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <RenderAdminMenu
                activeUser={props.activeUser}
                isAdmin={props.isAdmin}
                proposal={proposal}
                showAlert={showAlert}
                votingEndsIn={votingEndsIn}
                rerunProposalQuery={rerunProposalQuery}
                updateProposalDeleted={updateProposalDeleted}                
            />
            <RenderProposerMenu
                activeUser={props.activeUser}
                proposal={proposal}
                votingEndsIn={votingEndsIn}
                showAlert={showAlert}
                rerunProposalQuery={rerunProposalQuery}
                updateProposalDeleted={updateProposalDeleted}
                minRequested={props.minRequested}
            />
            {RenderProposalInfo()}
            <RenderDeliverablesList
                activeUser={props.activeUser}
                isAdmin={props.isAdmin}
                proposal={proposal}
                showAlert={showAlert}
                rerunProposalQuery={rerunProposalQuery}
                waxUsdPrice={props.waxUsdPrice}
                availableFunds={props.availableFunds}
            />
        </div>
    )
}