import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import * as globals from '../utils/vars.js';

import {requestedAmountToFloat} from '../utils/util.js'
import useQueryString from '../utils/useQueryString';
import RenderProposalList from "./ProposalList.js";
import RenderLoadingPage from './LoadingPage.js';
import RenderFilter from './Filter.js';
import { Link } from 'react-router-dom';

import { Accordion } from 'react-bootstrap';

import './GenericProposals.scss';

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
        <div className="genericProposals">
            <h2>Proposals</h2>
            <div className="genericProposals__filters">
                <div className="genericProposals__search">
                    <div className="input__label">Search</div>
                    <input
                        value={filterString}
                        type="text"
                        onChange={
                            (event) => {
                                setFilterString(event.target.value);
                                setFilterChanged(true);
                            }
                        }
                        placeholder="Proposal's name"
                        className="input"
                    />
                </div>
                <div className="genericProposals__filter">
                    <Accordion>
                        <Accordion.Toggle eventKey="1" className="button button--secondary">
                            More filters
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <div>
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
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                </div>
            </div>
            <div className="genericProposals__actions">
                <div className="genericProposals__createProposal">
                    {
                        !props.activeUser ?
                            <p>Log in to create a proposal</p>
                        :
                        !props.profile ?
                            <p>To create a proposal you need to <Link className="inlineLink" to={globals.ACCOUNT_PORTAL_LINK}>create your profile</Link></p>
                        :
                            <Link className="button button-primary" to={globals.DRAFT_PROPOSAL_LINK}>Create proposal</Link>
                    }
                </div>
                <div className="genericProposals__orderBy">
                    <select
                        value={orderByString}
                        className="select"
                        onChange={(event)=>setOrderByString(event.target.value)}
                    >
                        {globals.PROPOSAL_ORDER_BY_LIST.map((option, index) => {
                            return(
                                <option
                                    key={index}
                                    className="select__option"
                                    value={option}
                                >
                                    {globals.PROPOSAL_ORDER_BY_OBJECT[option]}
                                </option>
                            )
                        })}
                    </select>
                </div>
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