import React, {useState, useEffect} from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import {Carousel, Tab, Nav} from 'react-bootstrap';

import * as GLOBAL_VARS from '../utils/vars';
import {requestedAmountToFloat, numberWithCommas, getProposals, getStatBounds, calculateTime} from '../utils/util'
import { Link } from 'react-router-dom';
import RenderProposalCard from '../partials/ProposalCard';

import approved from '../images/proposalLifecycle/approved.png';
import drafting from '../images/proposalLifecycle/drafting.png';
import final from '../images/proposalLifecycle/final.png';
import progress from '../images/proposalLifecycle/progress.png';
import review from '../images/proposalLifecycle/review.png';

import VotingProposal from '../images/proposalLifecycle/VotingProposal';

import RightArrowIcon from '../icons/RightArrowIcon';

import './Home.scss'

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderHome(props) {

    const [queryingVoting, setQueryingVoting] = useState(true);
    const [inVotingProposals, setInVotingProposals] = useState([]);

    const [queryingInProgress, setQueryingInProgress] = useState(true);
    const [inProgressProposals, setInProgressProposals] = useState([]);

    const [queryingConfig, setQueryingConfig] = useState(true);
    const [configData, setConfigData] = useState({});

    const [queryingSubmitted, setQueryingSubmitted] = useState(true);
    const [submittedProposals, setSubmittedProposals] = useState([]);

    const [queryingCompleted, setQueryingCompleted] = useState(true);
    const [completedProposals, setCompletedProposals] = useState([]);

    useEffect(()=>{
        async function getInVotingProposals(){
            setQueryingVoting(true);
            let inVotingList = await getProposals(GLOBAL_VARS.BY_STAT_CAT_QUERY_TYPE, GLOBAL_VARS.VOTING_KEY, getStatBounds);
            setInVotingProposals(inVotingList);
            setQueryingVoting(false);
        }
        async function getSubmittedProposals(){
            setQueryingSubmitted(true);
            let submittedList =  await getProposals(GLOBAL_VARS.BY_STAT_CAT_QUERY_TYPE, GLOBAL_VARS.SUBMITTED_KEY, getStatBounds);
            setSubmittedProposals(submittedList);
            setQueryingSubmitted(false);
        }
        async function getCompletedProposals(){
            setQueryingCompleted(true);
            let completedList =  await getProposals(GLOBAL_VARS.BY_STAT_CAT_QUERY_TYPE, GLOBAL_VARS.COMPLETED_KEY, getStatBounds);
            setCompletedProposals(completedList);
            setQueryingCompleted(false);
        }
        async function getInProgressProposals(){
            setQueryingInProgress(true);
            let inProgressList = await getProposals(GLOBAL_VARS.BY_STAT_CAT_QUERY_TYPE, GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY, getStatBounds);
            setInProgressProposals(inProgressList);
            setQueryingInProgress(false);
        }
        async function getConfigData(){
            let success = false;
            do{
                try{
                    setQueryingConfig(true);
                    let configData = null;
                    let resp = await wax.rpc.get_table_rows({
                        code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        table: GLOBAL_VARS.CONFIG_TABLE,
                        json: true,
                        limit: 1,
                    });

                    if(resp.rows){
                        configData = resp.rows[0];
                        success = true;
                        configData.available_funds = requestedAmountToFloat(configData.available_funds).toFixed(2);
                        configData.display_available_funds = numberWithCommas(configData.available_funds).toString() + " WAX";
                    }
                    setConfigData(configData);
                    setQueryingConfig(false);

                }
                catch(e){
                    console.log(e);
                    success = false;
                }
            }while(!success)
        }
        getSubmittedProposals();
        getConfigData();
        getInVotingProposals();
        getInProgressProposals();
        getCompletedProposals();
    },[])
    console.log(configData)
    return (
        <div className="home">
            <div className="home__cover">
                <h1>Choose how to add value to the community</h1>
                <h4>Growing the WAX Blockchain through decentralization and innovation</h4>
                <Link to={GLOBAL_VARS.PROPOSALS_IN_VOTING_LINK} className="button button--primary">Vote for the latest proposals</Link>
            </div>
            <div className="home__numbers">
                <div className="home__waxNumbers home__number">
                    <h2>{queryingConfig ? " loading..." : " " + configData.display_available_funds}</h2>
                    <h4>Available funds</h4>
                </div>
                <div className="home__proposalsNumbers">
                    <div className="home__number">
                        <Link to={GLOBAL_VARS.PROPOSALS_IN_REVIEW_LINK}>
                            <h3>{queryingSubmitted ? " loading..." : " " + submittedProposals.length}</h3>
                            <h4>In review</h4>
                        </Link>
                    </div>
                    <div className="home__number">
                        <Link to={GLOBAL_VARS.PROPOSALS_IN_VOTING_LINK}>
                            <h3>{queryingVoting ? " loading..." : " " + inVotingProposals.length}</h3>
                            <h4>In voting</h4>
                        </Link>
                    </div>
                    <div className="home__number">
                        <Link to={GLOBAL_VARS.PROPOSALS_IN_PROGRESS_LINK}>
                            <h3>{queryingInProgress ? " loading..." : " " + inProgressProposals.length}</h3>
                            <h4>In progress</h4>
                        </Link>
                    </div>
                    <div className="home__number">
                        <Link to={GLOBAL_VARS.PROPOSALS_COMPLETED_LINK}>
                            <h3>{queryingCompleted ? " loading..." : " " + completedProposals.length}</h3>
                            <h4>Completed</h4>
                        </Link>
                    </div>
                </div>
            </div>
            {
                inVotingProposals.length > 0 ?
                    queryingVoting ?
                        <h1>loading ...</h1>
                    :
                        <Carousel
                            touch={true}
                            interval={null}
                        >
                            {
                                inVotingProposals.map((proposal, index) => {
                                    return (
                                        <Carousel.Item key={index}>
                                            <RenderProposalCard proposal={proposal} key={proposal.proposal_id} categories={props.categories} hideStatus={true} />
                                        </Carousel.Item>
                                    )
                                })
                            }
                        </Carousel>
                        :
                        ""
            }
            <div className="home__proposalLifecycle">
                <h3>The proposal lifecycle</h3>
                <p>Learn each step of the proposal process by selecting a proposal phase below.</p>
                <Tab.Container id="proposal-lifecycle" defaultActiveKey="drafting">
                    <Nav className="home__tabs">
                        <Nav.Link
                            eventKey="drafting"
                            className="home__tab"
                        >
                            <span className="tag tag--neutral">Drafting</span>
                        </Nav.Link>
                        <Nav.Link
                            eventKey="review"
                            className="home__tab"
                        >
                            <span className="tag tag--neutral">In Review</span>
                        </Nav.Link>
                        <Nav.Link
                            eventKey="approved"
                            className="home__tab"
                        >
                            <span className="tag tag--positive">Approved</span>
                        </Nav.Link>
                        <Nav.Link
                            eventKey="voting"
                            className="home__tab"
                        >
                            <span className="tag tag--attention">In Voting</span>
                        </Nav.Link>
                        <Nav.Link
                            eventKey="progress"
                            className="home__tab"
                        >
                            <span className="tag tag--attention">In Progress</span>
                        </Nav.Link>
                        <Nav.Link
                            eventKey="final"
                            className="home__tab home__tab--many"
                        >
                            <span className="tag tag--negative">Rejected</span>
                            <span className="tag tag--negative">Failed</span>
                            <span className="tag tag--positive">Completed</span>
                        </Nav.Link>
                    </Nav>
                    <Tab.Content className="home__content">
                        <div className="home__scrollMessage">
                            <p>Scroll right to see all actions for this phase.</p>
                            <RightArrowIcon/>
                        </div>
                        <Tab.Pane className="home__tabPane" eventKey="drafting">
                            <img  src={drafting} alt="Flow for a drafting proposal."/>
                        </Tab.Pane>
                        <Tab.Pane className="home__tabPane" eventKey="review">
                            <img  src={review} alt="Flow for a proposal that is in review."/>
                        </Tab.Pane>
                        <Tab.Pane className="home__tabPane" eventKey="approved">
                            <img  src={approved} alt="Flow for an approved proposal."/>
                        </Tab.Pane>
                        <Tab.Pane className="home__tabPane home__tabPane--large" eventKey="voting">
                            <h1>{configData.voting_duration}</h1>
                            <VotingProposal votingDuration={calculateTime(configData.vote_duration)}/>
                        </Tab.Pane>
                        <Tab.Pane className="home__tabPane" eventKey="progress">
                            <img  src={progress} alt="Flow for a proposal that is in progress."/>
                        </Tab.Pane>
                        <Tab.Pane className="home__tabPane" eventKey="final">
                            <img  src={final} alt="Flow for a proposal that is either cancelled, rejected or completed."/>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>

        </div>
    );
}
