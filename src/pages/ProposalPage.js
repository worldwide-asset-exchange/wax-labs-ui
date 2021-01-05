import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Link, useParams} from 'react-router-dom';

import * as waxjs from "@waxio/waxjs/dist";

import {sleep, requestedAmountToFloat, tagStyle} from "../utils/util";
import * as GLOBAL_VARS from '../utils/vars';
import RenderProposerMenu from '../partials/ProposalPage/ProposerMenu';
import RenderAlerts from '../partials/ProposalPage/Alerts';
import RenderLoadingPage from '../partials/LoadingPage';
import RenderVotesDisplay from '../partials/ProposalPage/VotesDisplay';
import RenderDeliverablesList from '../partials/ProposalPage/DeliverablesList';
import RenderAdminMenu from '../partials/ProposalPage/AdminMenu';

import './ProposalPage.scss';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const readableProposalStatus = GLOBAL_VARS.READABLE_PROPOSAL_STATUS;


export default function RenderProposalPage(props){    
    const {id} = useParams();    
    const [proposal, setProposal] = useState({
        proposer: '',
        category: '',
        status: '',
        title: '',
        description: '',
        content: '',
        total_requested_funds: '',
        image_url: '',
        remaining_funds: '',
        deliverables: '',
        deliverables_completed: '',
        reviewer: '',
        ballot_name: '',
        ballot_results: [],
    });
    const [alertList, setAlertList] = useState([]);
    const [endTime, setEndTime] = useState(null);
    const [votes, setVotes] = useState({});
    const [proposalQueryCount, setProposalQueryCount] = useState(1);
    const [body, setBody] = useState(null);

    const votingEndsIn = moment(endTime, "YYYY-MM-DDTHH:mm:ss[Z]").parseZone().fromNow();
    const readableEndTime = moment(endTime).format("MMMM Do, YYYY [at] h:mm:ss a [UTC]");

    async function getProposalData(){
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
            responseProposal.total_requested_funds = requestedAmountToFloat(responseProposal.total_requested_funds) + ' WAX';
            setProposal(responseProposal);
           
        } catch (e){
            console.log(e);
        }
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
   
    // console.log(proposal);
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
                    src={proposal.image_url}
                    alt="Chosen by the proposer"
                    className="proposalPage__image"/>
                <div className="proposalPage__row">
                    <div className="proposalPage__column">
                    <h1>{proposal.title}</h1>
                            <p className="proposalPage__paragraph--bold">{proposal.description}</p>
                    <p>{body}</p>
                </div>
                    <div className="proposalPage__column">
                        <div className="proposalPage__status">
                            <div className={`tag ${tagStyle(proposal.status)} proposalPage__statusTag`}>
                                {readableProposalStatus[proposal.status]}
                            </div>
                            <div className="tag tag--category">{props.categories[proposal.category]}</div>
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
                />

                            <div className="proposalPage__proposalDetails">
                                <div className="proposalPage__details">
                                    <div className="proposalPage__label">Proposer</div>
                                    <Link className="proposalPage__accountID proposalPage__accountID--link"
                                            to={"/account/" + proposal.proposer}>{proposal.proposer}</Link>
                                </div>
                                <div className="proposalPage__details">
                                    <div className="proposalPage__label">Reviewer</div>
                                    <div className="proposalPage__accountID">{proposal.reviewer}</div>
                                </div>
                                <div className="proposalPage__details">
                                    <div className="proposalPage__label">Total Requested Funds</div>
                                    <div className="proposalPage__amount">{proposal.total_requested_funds}</div>
                                </div>
                            </div>
                            </div>
                    </div>
                </div>
            </div>
       )
    }

    useEffect(()=>{
        getProposalData();
        getContentData();
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

    if(!proposal){
        return <RenderLoadingPage />
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
            />
            <RenderProposerMenu 
                activeUser={props.activeUser}
                proposal={proposal}
                votingEndsIn={votingEndsIn}
                showAlert={showAlert}
                rerunProposalQuery={rerunProposalQuery}
            />
            {RenderProposalInfo()}
            <RenderDeliverableList 
                activeUser={props.activeUser}
                isAdmin={props.isAdmin}
                proposal={proposal}
                showAlert={showAlert}
                rerunProposalQuery={rerunProposalQuery}
            />
        </div>
    )
}