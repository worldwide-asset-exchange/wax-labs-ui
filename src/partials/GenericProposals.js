import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import * as globals from '../utils/vars.js';

import {requestedAmountToFloat} from '../utils/util.js'
import useQueryString from '../utils/useQueryString';
import RenderProposalList from "./ProposalList.js";
import RenderLoadingPage from './LoadingPage.js';
import RenderFilter from './Filter.js';
import { Link } from 'react-router-dom';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderGenericProposals(props) {
    // list of proposals that were got from the query. Supposed to update 
    // whenever queryArgs changes.
    const [proposals, setProposals] = useState([]);

    // This is for pagination on RenderProposalList to know if a 
    // filter was changed. It needs to change page to 1 if that happens. 
    const [filterChanged, setFilterChanged] = useState(false);

    // Flags to know when to display loading page.
    const [querying, setQuerying] = useState(true);
    const [filtering, setFiltering] = useState(true);

    // Filtered proposals is supposed to contain the filtered list of proposals.
    // This is updated whenever proposals, categoriesList, filterString 
    // or orderByString changes.
    const [filteredProposals, setFilteredProposals] = useState([]);

    // QueryArgs are arguments to be passed to the getProposals query.
    // Updated whenever the querystring changes.
    const [queryArgs, setQueryArgs] = useState([]);

    // Hooks regarding filtering of the query. Automatically update query string
    // on set.
    const [categoriesList, setCategoriesList] = useQueryString(globals.CATEGORIES_QUERY_STRING_KEY, null);
    const [statusList, setStatusList] = useQueryString(globals.STATUS_QUERY_STRING_KEY, []);
    const [filterString, setFilterString] = useQueryString(globals.SEARCH_QUERY_STRING_KEY, "");

    // Hooks regarding ordering of the list. Automatically update query string on set.
    const [orderByString, setOrderByString] = useQueryString(globals.ORDER_BY_QUERY_STRING_KEY, globals.PROPOSAL_ORDER_BY_LIST[0]);
    
    function filterByStatus(proposal){
        if(!statusList){
            return true;
        } else if (!Array.isArray(statusList)){
            return (statusList === proposal.status)
        } else if (!statusList.length){
            return true            
        }else {
            return (statusList.includes(proposal.status))
        }
    }
    function filterByCategories(proposal){
        if(!categoriesList){
            return true;
        } else if (!Array.isArray(categoriesList)){
            return (categoriesList === proposal.category)
        } else if (!categoriesList.length){
            return true            
        }else {
            return (categoriesList.includes(proposal.category))
        }
    }

    function filterByName(proposal){
        if(!filterString){
            return true;
        } else {
            return (
                proposal.proposer.toLowerCase().includes(filterString.toLowerCase()) 
                || proposal.title.toLowerCase().includes(filterString.toLowerCase())
                || proposal.description.toLowerCase().includes(filterString.toLowerCase())
            )
        }
    }

    useEffect(()=>{
        setFiltering(true);
        let newFilteredProposals = []
        newFilteredProposals = proposals.slice(0).filter(filterByCategories)
        newFilteredProposals = newFilteredProposals.filter(filterByStatus)
        newFilteredProposals = newFilteredProposals.filter(filterByName)
        newFilteredProposals.sort(proposalComparison);
        setFilteredProposals(newFilteredProposals);
        setFiltering(false);
        //eslint-disable-next-line
    },[categoriesList, proposals, filterString, orderByString, statusList]);
    
    function proposalComparison(proposalA, proposalB) {
        let [field, mode] = orderByString.split(globals.SEPARATOR_ORDER_BY)
        if(field === globals.REQUESTED_ORDER_BY_FIELD){
            if(mode === globals.ASCENDANT_ORDER_BY_MODE){
                return(
                    requestedAmountToFloat(proposalA.total_requested_funds) 
                    - requestedAmountToFloat(proposalB.total_requested_funds)
                )
            } else if(mode === globals.DESCENDANT_ORDER_BY_MODE){
                return(
                    requestedAmountToFloat(proposalB.total_requested_funds) 
                    - requestedAmountToFloat(proposalA.total_requested_funds)
                )
            }
        } else if(field === globals.CREATED_ORDER_BY_FIELD){
            if(mode === globals.ASCENDANT_ORDER_BY_MODE){
                return (
                    proposalA.proposal_id - proposalB.proposal_id
                )
            } else if(mode === globals.DESCENDANT_ORDER_BY_MODE){
                return(
                    proposalB.proposal_id - proposalA.proposal_id
                )                
            }
        }
    }



    // useEffect(() => {
    //     let cancelled = false
    //     async function getProposals() {
    //         try {
    //             setQuerying(true);
    //             let proposalsArray = []
    //             console.log(queryArgs);
    //             if(queryArgs.length === globals.PROPOSAL_ALL_QUERY_ARGS_LIST.length){
    //                 let resp = await wax.rpc.get_table_rows({             
    //                     code: globals.LABS_CONTRACT_ACCOUNT,
    //                     scope: globals.LABS_CONTRACT_ACCOUNT,
    //                     table: globals.PROPOSALS_TABLE,
    //                     json: true,
    //                     limit: 100000,
    //                 });
    //                 console.log(resp);
    //                 if(resp.rows){
    //                     proposalsArray = resp.rows        
    //                 }
    //             }
    //             else {
    //                 for(let i=0; i < queryArgs.length; i++){
    //                     let arg = queryArgs[i];
    //                     let resp = await wax.rpc.get_table_rows({             
    //                         code: globals.LABS_CONTRACT_ACCOUNT,
    //                         scope: globals.LABS_CONTRACT_ACCOUNT,
    //                         table: globals.PROPOSALS_TABLE,
    //                         json: true,
    //                         index_position: arg.indexPosition,
    //                         lower_bound: arg.bound,
    //                         upper_bound: arg.bound,
    //                         key_type: globals.NAME_KEY_TYPE,
    //                         limit: 100000,
    //                     });                  
    //                     console.log(resp);   
    //                     proposalsArray = [...proposalsArray, ...resp.rows]
    //                 }
    //             }
                                         
    //             if(!cancelled){
    //                 console.log(proposalsArray);
    //                 setProposals(proposalsArray);
    //                 setQuerying(false);                            
    //             }
    //         } catch(e) {
    //             console.log(e);
    //         }
    //     }
    //     if(queryArgs){
    //         getProposals();
    //     }
    //     const cleanup = () => { cancelled = true }
    //     return cleanup
    // }, [queryArgs]);

    useEffect(() => {
        let cancelled = false
        async function getProposals() {
            let success = false;
            do{
                try {
                    setQuerying(true);
                    let proposalsArray = []
    
                    let nextId="0";
                    let resp = {}
                    do{
                        resp = await wax.rpc.get_table_rows({             
                            code: globals.LABS_CONTRACT_ACCOUNT,
                            scope: globals.LABS_CONTRACT_ACCOUNT,
                            table: globals.PROPOSALS_TABLE,
                            json: true,
                            lower_bound: nextId,
                            limit: 3000,
                        });
                        console.log(resp);
                        if(resp.rows){
                            proposalsArray = [...proposalsArray, ...resp.rows]        
                        }                    
                        nextId = resp.next_key; 
                    }while(resp.more)         
                                             
                    if(!cancelled){
                        console.log(proposalsArray);
                        setProposals(proposalsArray);
                        setQuerying(false);                            
                    }
                    success = true;
                } catch(e) {
                    console.log(e);
                    success = false;
                }
            }while(!success)
        }
        getProposals();        
        const cleanup = () => { cancelled = true }
        return cleanup
    }, []);


    function updateStatusList (newList){
        setFilterChanged(true);
        setStatusList(newList);
    }

    function updateCategoriesList (newList){
        setFilterChanged(true);
        setCategoriesList(newList);
    }
        
    return (
        <div className="proposals-body">
            <h2>Proposals</h2>
            <div className="filters">
                <RenderFilter
                    title="Status Filters"
                    currentList={statusList}
                    fullList={globals.PROPOSALS_STATUS_KEYS}
                    updateCurrentList={updateStatusList}
                    readableNameDict={globals.READABLE_PROPOSAL_STATUS}
                />            
                <RenderFilter
                    title="Category Filters"
                    currentList={categoriesList}
                    fullList={props.categories}
                    updateCurrentList={updateCategoriesList}                    
                />

                <div className="search-filter">
                    <h3>Search</h3>
                    <input
                        value={filterString} 
                        type="text" 
                        onChange={
                            (event) => {
                                setFilterString(event.target.value);
                                setFilterChanged(true);
                            }
                        }
                        placeholder="Search for proposals"
                    />
                </div>

                <div className="order-by-container">
                    <select 
                        value={orderByString} 
                        className="order-by-select" 
                        onChange={(event)=>setOrderByString(event.target.value)}
                    >
                        {globals.PROPOSAL_ORDER_BY_LIST.map((option, index) => {
                            return(
                                <option
                                    key={index}
                                    className="order-by-option"
                                    value={option}
                                >
                                    {globals.PROPOSAL_ORDER_BY_OBJECT[option]}
                                </option>
                            )
                        })}
                    </select>
                </div>

            </div>
            <div className="create-proposal">
                {
                    !props.activeUser ?
                        <h5>Log in to create a proposal</h5>
                    :
                    !props.profile ?
                        <h5>To create a proposal you need to <Link to={globals.ACCOUNT_PORTAL_LINK}>create your profile</Link></h5>
                    :
                        <Link className="btn" to={globals.DRAFT_PROPOSAL_LINK}>Create proposal</Link>
                }
            </div>
            <div className="filtered-proposals review-proposals">
                {  
                    filtering || querying ?
                    <RenderLoadingPage/>
                    : 
                    <RenderProposalList
                        filterChanged = {filterChanged}
                        proposalsList = {filteredProposals}
                        noProposalsMessage={props.noProposalsMessage}
                    />
                }
            </div>
        </div>
    );
        
    }