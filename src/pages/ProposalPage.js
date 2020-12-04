import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Link, useParams} from 'react-router-dom';

import * as waxjs from "@waxio/waxjs/dist";

import {sleep} from "../utils/util";
import RenderProposerMenu from '../partials/ProposalPage/ProposerMenu';
import RenderAlerts from '../partials/ProposalPage/Alerts';
import RenderLoadingPage from '../partials/LoadingPage';
import RenderVotesDisplay from '../partials/ProposalPage/VotesDisplay';
import RenderDeliverableList from '../partials/ProposalPage/DeliverableList';
import RenderAdminMenu from '../partials/ProposalPage/AdminMenu';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
const readableProposalStatus = {
    drafting: "Draft",
    submitted: "In review",
    approved: "Approved",
    voting: "In vote",
    completed: "Complete",
    cancelled: "Cancelled",
    inprogress: "In progress",
    failed: "Failed",
}

export default function RenderProposalPage(props){
    RenderProposalPage.propTypes = {
        activeUser: PropTypes.any.isRequired,
        isAdmin: PropTypes.any.isRequired,
    }
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
                code: 'labs',
                scope: 'labs',
                table: 'proposals',
                json: true,
                lower_bound: id,
                upper_bound: id,
            });
            let responseProposal = resp.rows[0]
            /*Getting rid of the ".00000000 WAX" */
            responseProposal.total_requested_funds = responseProposal.total_requested_funds.slice(0,-13) + ' WAX';
            setProposal(responseProposal);
            console.log(responseProposal);
           
        } catch (e){
            console.log(e);
        }
    }
   
    console.log(proposal);
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
        // console.log(proposal);
        // console.log(props.activeUser);
        return (
            <div className="proposal-details">
                <div className="proposal-header">
                    <h1>{proposal.title}</h1>
                    <h3>- {proposal.category}</h3>
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
        await sleep(1000);
        setProposalQueryCount(proposalQueryCount + 1);
    }
    function showAlert(alertObj){
        let alerts = alertList.slice(0);
        alerts.push(alertObj);
        setAlertList(alerts);
    }
    function removeAlert(index){
        let alerts = alertList.slice(0);
        alerts.splice(index,1);
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