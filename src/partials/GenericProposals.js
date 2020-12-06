import React, { useState, useEffect } from 'react';
import { Link, useLocation, BrowserRouter as Router } from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";
import queryString from 'query-string';

import RenderProposalGrid from "./ProposalGridSingle.js";
import {sleep} from '../utils/util.js'
import useQueryString from '../utils/useQueryString';
import RenderProposalFilter from "./ProposalFilter.js";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const allArgsQuery = []
const queryArgsObject = {
    drafting:   {bound: 'drafting',   indexPosition: "fourth"},
    submitted:  {bound: 'submitted',  indexPosition: "fourth"},
    approved:   {bound: 'approved',   indexPosition: "fourth"},
    voting:     {bound: 'voting',     indexPosition: "fourth"},
    completed:  {bound: 'completed',  indexPosition: "fourth"},
    cancelled:  {bound: 'cancelled',  indexPosition: "fourth"},
    inprogress: {bound: 'inprogress', indexPosition: "fourth"},
    failed:     {bound: 'failed',     indexPosition: "fourth"},
}

function addEntriesToList(list, object){
    Object.entries(object).forEach(([key, value]) => {
        list.push(value);
    })
}

function setup(){
    addEntriesToList(allArgsQuery, queryArgsObject);
}

setup();

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

export default function RenderGenericProposals(props) {
    const [categories, setCategories] = useState([]);
    // list of proposals that were got from the query. Supposed to update 
    // whenever queryArgs changes.
    const [proposals, setProposals] = useState([]);
    // Filtered proposals is supposed to contain the filtered list of proposals.
    // That is updated whenever proposals, or filtered args state changes.
    const [filteredProposals, setFilteredProposals] = useState([]);
    // QueryArgs are arguments to be passed to the getProposals query.
    // Updated whenever the querystring changes.
    const [queryArgs, setQueryArgs] = useState([]);
    // FilterArgs are supposed to assist filtering the list that was 
    // loaded by getProposals. Updated whenever the querystring changes.
    const [filterArgs, setFilterArgs] = useState([]);


    const [categoriesList, setCategoriesList] = useQueryString("categories", []);
    const [statusList, setStatusList] = useQueryString("status", []);
    const [filterString, setFilterString] = useState([]);

 
    useEffect(()=>{
        function updateQueryArgs(){
            console.log(statusList);
            let newQueryArgs = []            
            if(!Array.isArray(statusList)){
                newQueryArgs.push(queryArgsObject[statusList]);
            }else if(statusList.length === 0){
                newQueryArgs = allArgsQuery;
            }else {
                statusList.map((status) => {
                    newQueryArgs.push(queryArgsObject[status])
                });
            } 
            console.log(newQueryArgs);
            setQueryArgs(newQueryArgs);
        }
        updateQueryArgs();
    },[categoriesList, statusList, filterString]);
    
    useEffect(()=>{      
        // setStatusList(["completed","drafting"]);
    },[]);
    useEffect(() => {
        async function getProposals() {
            try {
                // console.log(props.queryArgs);
                let proposalsArray = []
                for(let i=0; i < queryArgs.length; i++){
                    let arg = queryArgs[i];
                    let resp = await wax.rpc.get_table_rows({             
                        code: 'labs',
                        scope: 'labs',
                        table: 'proposals',
                        json: true,
                        index_position: arg.indexPosition,
                        lower_bound: arg.bound,
                        upper_bound: arg.bound,
                        key_type: 'name'
                    });                  
                    console.log(resp);   
                                         
                    proposalsArray = [...proposalsArray, ...resp.rows]
                   
                }
                setProposals(proposalsArray);                            
            } catch(e) {
                console.log(e);
            }
        }
        if(queryArgs){
            getProposals();
        }
    }, [queryArgs]);


        
       
    return (
        <div className="proposals-body">
            <h2>Proposals</h2>
            <div className="filtered-proposals review-proposals">
                {   
                    proposals.length ?
                        proposals.map((proposal) =>
                            <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)
                    :
                    <p>{props.noProposalsMessage}</p>
                }
            </div>
        </div>
    );
        
    }