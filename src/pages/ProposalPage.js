import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Link, useParams} from 'react-router-dom';

import * as waxjs from "@waxio/waxjs/dist";

import RenderProposerMenu from '../partials/ProposalPage/ProposerMenu';

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
        remaining_funds: '',
        deliverables: '',
        deliverables_completed: '',
        reviewer: '',
        ballot_name: '',
        ballot_results: [],
    });
    const [endTime, setEndTime] = useState(null);
    const [votes, setVotes] = useState(null);

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
            setProposal(responseProposal);
           
        } catch (e){
            console.log(e);
        }
    }

    useEffect(()=>{
        getProposalData();
    },[id])

    return (
        <RenderProposerMenu />
    )
}