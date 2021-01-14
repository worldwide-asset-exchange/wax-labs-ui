import React, {useState, useEffect} from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import {Carousel} from 'react-bootstrap';

import * as GLOBAL_VARS from '../utils/vars';
import {requestedAmountToFloat, numberWithCommas, getProposals, getStatBounds} from '../utils/util'
import { Link } from 'react-router-dom';
import RenderProposalCard from '../partials/ProposalCard';

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
    },[])

    return (
        <div className="home">
            <div className="home__cover">
                <h1>Choose how to add value to the community</h1>
                <h4>Growing the WAX Blockchain through decentralization and innovation</h4>
                <Link to={GLOBAL_VARS.PROPOSALS_IN_VOTING_LINK} className="button button--primary">Vote for the latest proposals</Link>
            </div>
            <div className="home__numbers">
                <div className="home__number">
                    <Link to={GLOBAL_VARS.PROPOSALS_IN_VOTING_LINK}>
                        <h2>{queryingVoting ? " loading..." : " " + inVotingProposals.length}</h2>
                        <h4>In voting</h4>
                    </Link>
                </div>
                <div className="home__number">
                    <Link to={GLOBAL_VARS.PROPOSALS_IN_PROGRESS_LINK}>
                        <h2>{queryingInProgress ? " loading..." : " " + inProgressProposals.length}</h2>
                        <h4>In progress</h4>
                    </Link>
                </div>
                <div className="home__number">
                    <h2>{queryingConfig ? " loading..." : " " + configData.display_available_funds}</h2>
                    <h4>Available funds</h4>
                </div>
                <div className="home__number">
                    <Link to={GLOBAL_VARS.PROPOSALS_IN_REVIEW_LINK}>
                        <h2>{queryingSubmitted ? " loading..." : " " + submittedProposals.length}</h2>
                        <h4>In review</h4>
                    </Link>
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
                            {inVotingProposals.map((proposal, index) => {
                                return (
                                    <Carousel.Item key={index}>
                                        <RenderProposalCard proposal={proposal} key={proposal.proposal_id} categories={props.categories} hideStatus={true} />)
                                    </Carousel.Item>
                                )
                            })}
                        </Carousel>
                        :
                        ""
            }

        </div>
    );
}
