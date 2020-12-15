import React, {useState, useEffect} from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import {Carousel} from 'react-bootstrap';

import * as GLOBAL_VARS from '../utils/vars';
import {requestedAmountToFloat, numberWithCommas} from '../utils/util'
import { Link } from 'react-router-dom';


const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderHome() {

    const [queryingVoting, setQueryingVoting] = useState(true);
    const [inVotingProposals, setInVotingProposals] = useState([]);

    const [queryingInProgress, setQueryingInProgress] = useState(true);
    const [inProgressProposals, setInProgressProposals] = useState([]);

    const [queryingConfig, setQueryingConfig] = useState(true);
    const [configData, setConfigData] = useState({});

    const [queryingSubmitted, setQueryingSubmitted] = useState(true);
    const [submittedProposals, setSubmittedProposals] = useState([]);

    const [imagesWithErrors, setImagesWithErrors] = useState({});

    useEffect(()=>{
        async function getInVotingProposals(){
            let success = false;
            do{
                try{
                    // console.log(GLOBAL_VARS.PROPOSALS_TABLE);
                    setQueryingVoting(true);
                    let votingProposalsArray = []
                    let resp = await wax.rpc.get_table_rows({
                        code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        table: GLOBAL_VARS.PROPOSALS_TABLE,
                        json: true,
                        index_position: GLOBAL_VARS.PROPOSALS_TABLE_STATUS_INDEXPOSITION,
                        lower_bound: GLOBAL_VARS.VOTING_KEY,
                        upper_bound: GLOBAL_VARS.VOTING_KEY,
                        key_type: GLOBAL_VARS.NAME_KEY_TYPE,
                        limit: 3000,
                    });

                    if(resp.rows){
                        votingProposalsArray = [...resp.rows]
                    }

                    setInVotingProposals(votingProposalsArray);
                    setQueryingVoting(false);
                    
                    success = true;
                }
                catch(e){
                    console.log(e);
                    success = false;
                }
            }while(!success)
        }
        async function getSubmittedProposals(){
            let success = false;
            do{
                try{
                    // console.log(GLOBAL_VARS.PROPOSALS_TABLE);
                    setQueryingSubmitted(true);
                    let submittedProposalsArray = []
                    let resp = await wax.rpc.get_table_rows({
                        code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        table: GLOBAL_VARS.PROPOSALS_TABLE,
                        json: true,
                        index_position: GLOBAL_VARS.PROPOSALS_TABLE_STATUS_INDEXPOSITION,
                        lower_bound: GLOBAL_VARS.SUBMITTED_KEY,
                        upper_bound: GLOBAL_VARS.SUBMITTED_KEY,
                        key_type: GLOBAL_VARS.NAME_KEY_TYPE,
                        limit: 3000,
                    });

                    if(resp.rows){
                        submittedProposalsArray = [...resp.rows]
                    }

                    setSubmittedProposals(submittedProposalsArray);
                    setQueryingSubmitted(false);
                    
                    success = true;
                }
                catch(e){
                    console.log(e);
                    success = false;
                }
            }while(!success)
        }
        
        async function getInProgressProposals(){
            let success = false;
            do{
                try{
                    // console.log(GLOBAL_VARS.PROPOSALS_TABLE);
                    setQueryingInProgress(true);
                    let inProgressProposalsArray = []
                    let resp = await wax.rpc.get_table_rows({
                        code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        table: GLOBAL_VARS.PROPOSALS_TABLE,
                        json: true,
                        index_position: GLOBAL_VARS.PROPOSALS_TABLE_STATUS_INDEXPOSITION,
                        lower_bound: GLOBAL_VARS.INPROGRESS_KEY,
                        upper_bound: GLOBAL_VARS.INPROGRESS_KEY,
                        key_type: GLOBAL_VARS.NAME_KEY_TYPE,
                        limit: 3000,
                    });

                    if(resp.rows){
                        inProgressProposalsArray = [...resp.rows]
                    }

                    setInProgressProposals(inProgressProposalsArray);
                    setQueryingInProgress(false);
                    
                    success = true;
                }
                catch(e){
                    console.log(e);
                    success = false;
                }
            }while(!success)
        }
        async function getConfigData(){
            let success = false;
            do{
                try{
                    // console.log(GLOBAL_VARS.PROPOSALS_TABLE);
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
                        configData.available_funds = requestedAmountToFloat(configData.available_funds).toFixed(0)
                        configData.display_available_funds = numberWithCommas(configData.available_funds).toString() + " WAX"
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
        <div>
            <div>
                <h1>
                    Choose how to add value to the community
                </h1>
                <p>Growing the WAX Blockchain through decentralization and innovation</p>
                <Link to="/proposals?status=voting" className="btn">Vote for the latest proposals</Link>
            </div>
            {
                queryingVoting ?
                    <h1>loading ...</h1>
                :
                    <Carousel
                        touch={true}
                        interval={null}
                    >
                        {inVotingProposals.map((proposal, index) => {
                            return (
                                <Carousel.Item>
                                    <img 
                                        src={imagesWithErrors[proposal.proposal_id] ? GLOBAL_VARS.DEFAULT_PROPOSAL_IMAGE_URL : proposal.image_url} 
                                        alt={proposal.title} 
                                        className="d-block w-100" 
                                        onError={
                                            () =>{
                                                let errorDict = {...imagesWithErrors}
                                                errorDict[proposal.proposal_id] = true
                                                setImagesWithErrors(errorDict);
                                            } 
                                        }
                                    />
                                    <Carousel.Caption>
                                        <p>{proposal.title}</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            )
                        })}
                    </Carousel>
            }
            <div>
                in voting 
                {queryingVoting ? " loading..." : " " + inVotingProposals.length}
            </div>
            <div>
                in progress 
                {queryingInProgress ? " loading..." : " " + inProgressProposals.length}
            </div>
            <div>
                available funds
                {queryingConfig ? " loading..." : " " + configData.display_available_funds}
            </div>
            <div>
                in review
                {queryingSubmitted ? " loading..." : " " + submittedProposals.length}
            </div>
        </div>
    );
}
