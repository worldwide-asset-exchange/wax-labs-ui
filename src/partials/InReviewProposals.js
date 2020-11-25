import React, { useState, useEffect } from 'react';
import { Link/*, Routes, Route, useParams*/ } from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";
import RenderProposalFilter from "./ProposalFilter.js";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderInReviewProposals(props) {
    const [proposals, setProposals ] = useState();
    const from_admin = props.from_admin;

    useEffect(() => {
        async function getInReviewProposals() {
        try {
            let inrevResp = await wax.rpc.get_table_rows({             
                  code: 'labs',
                  scope: 'labs',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'submitted',
                  upper_bound: 'submitted',
                  key_type: 'name'
              });
            
            
            if (!inrevResp.rows.length) {
                return null
            } else {
                setProposals(inrevResp.rows);
            }  
             
            } catch(e) {
              console.log(e);
            }
        }
        getInReviewProposals();
        }, []);

        function RenderBreadcrumbs(){
            if (from_admin === "true") {
                return <Link to="/admin">{'< Back to Admin'}</Link>;
            } else {
                return null;
            }
        }

        if (!proposals){
            console.log(from_admin);
            return (
                <div className="proposals-body">
                    <RenderBreadcrumbs />
                    <h2>Proposals</h2>
                    <RenderProposalFilter activeUser={props.activeUser} isAdmin={props.isAdmin} />
                    <div className="filtered-proposals review-proposals">
                        <h3>Proposals Under Review</h3>
                        <p>There are currently no proposals to review.</p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="proposals-body">
                    <RenderBreadcrumbs />
                    <h2>Proposals</h2>
                    <RenderProposalFilter activeUser={props.activeUser} isAdmin={props.isAdmin} />
                    <div className="filtered-proposals review-proposals">
                        <h3>Proposals Under Review</h3>
                        {proposals.map((proposal) =>
                        <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                    </div>
                </div>
            );
        }
    }