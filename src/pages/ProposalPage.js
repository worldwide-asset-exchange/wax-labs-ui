import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Link, useParams} from 'react-router-dom';

import * as waxjs from "@waxio/waxjs/dist";

import {sleep, requestedAmountToFloat} from "../utils/util";
import * as GLOBAL_VARS from '../utils/vars';
import RenderProposerMenu from '../partials/ProposalPage/ProposerMenu';
import RenderAlerts from '../partials/ProposalPage/Alerts';
import RenderLoadingPage from '../partials/LoadingPage';
import RenderVotesDisplay from '../partials/ProposalPage/VotesDisplay';
import RenderDeliverableList from '../partials/ProposalPage/DeliverableList';
import RenderAdminMenu from '../partials/ProposalPage/AdminMenu';

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
            <div className="proposal-details">
                <div className="proposal-header">
                    <h1>{proposal.title}</h1>
                    <h3>- {props.categories[proposal.category]}</h3>
                    <p>{proposal.description}</p>
                </div>
                <hr />
                <div className="proposal-info">
                    <strong>Submitted by: </strong> <Link to={"/account/" + proposal.proposer}>{proposal.proposer}</Link><p/>
                    <p><strong>Status:</strong> {readableProposalStatus[proposal.status]}</p>
                    <p><strong>Reviewer:</strong> {proposal.reviewer}</p>
                    <p><strong>Total Requested Funds:</strong> {proposal.total_requested_funds}</p>
                </div>
                <div className="proposal-content">
                    <p>{proposal.content}</p>
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
                />
            </div>
       )
    }

    useEffect(()=>{
        getProposalData();
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
        <div className="proposal-page">
            <RenderAlerts 
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <RenderAdminMenu
                activeUser={props.activeUser}
                isAdmin={props.isAdmin}
                proposal={proposal}
                showAlert={showAlert}
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