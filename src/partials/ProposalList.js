import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {getQueryStringValue} from '../utils/queryString';
import ReactPaginate from 'react-paginate';
import useQueryString from '../utils/useQueryString';

import {useWindowSize} from '../utils/util';
import * as GLOBAL_VARS from "../utils/vars";
import RenderProposalCard from "./ProposalCard.js";

const reactPaginateObject = {
    mobile: {marginPagesDisplayed:1, pageRangeDisplayed:1},
    tablet_mobile_up : {marginPagesDisplayed:1, pageRangeDisplayed:7},
    tablet_up: {marginPagesDisplayed:1, pageRangeDisplayed: 11},
    tablet_landscape_up: {marginPagesDisplayed:1, pageRangeDisplayed:17},
    desktop: {marginPagesDisplayed:1, pageRangeDisplayed:21},
}
const perPage = 10;

export default function RenderProposalList(props){

    const [page, setPage] = useQueryString(GLOBAL_VARS.PAGE_QUERY_STRING_KEY, 1);
    let location = useLocation();

    const windowSize = useWindowSize();

    useEffect(()=>{
        let newPage = getQueryStringValue(GLOBAL_VARS.PAGE_QUERY_STRING_KEY) ||  1 ;

        setPage({value: newPage, skipUpdateQS: true});
        //eslint-disable-next-line
    }, [location])


    function calculateNumberOfPages() {
        let totalProperties = props.proposalsList.length;
        if (totalProperties === 0){
            return 1;
        }
        return Math.ceil(totalProperties/perPage);
    }
    function pageChange(data) {
        let selected = data.selected;
        console.log(data);
        setPage(selected + 1);
    }

    let pagesList = []
    for(let i = 1; i<=calculateNumberOfPages(); i++){
        pagesList.push(i);
    }

    //The min is needed in case the user had a link that points to an unexisting page,
    // in that case we point him to the last page.
    const indexOfLastAsset = Math.min((calculateNumberOfPages()), (page)) * perPage;
    const indexOfFirstAsset = indexOfLastAsset - perPage;

    let paginatedProperties = props.proposalsList.slice(indexOfFirstAsset, indexOfLastAsset);

    let paginateObject = reactPaginateObject[windowSize.breakpoint];
    
    return (
        <React.Fragment>
            {
                paginatedProperties.length ?
                paginatedProperties.map((proposal) =>
                    <RenderProposalCard proposal={proposal} key={proposal.proposal_id} categories={props.categories} />)
                :
                <p>{props.noProposalsMessage}</p>
            }
            <ReactPaginate
                previousLabel={'<'}
                nextLabel=">"
                breakLabel="..."
                // In case the page is pointing to a number too big, we point it to the last page.
                forcePage={Math.min((calculateNumberOfPages() - 1), (page - 1))}
                pageCount={calculateNumberOfPages()}
                marginPagesDisplayed={paginateObject.marginPagesDisplayed}
                pageRangeDisplayed={paginateObject.pageRangeDisplayed}
                onPageChange={pageChange}
                containerClassName='pagination'
                pageLinkClassName="page-link"
                nextLinkClassName="page-link"
                previousLinkClassName="page-link"
                breakLinkClassName="page-link"
                breakClassName="page-item"
                pageClassName="page-item"
                previousClassName="page-item"
                nextClassName="page-item"
                subContainerClassName='pages pagination'
                activeClassName="active"
            />

        </React.Fragment>
    )
}