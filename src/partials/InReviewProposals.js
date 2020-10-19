import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

export default function RenderInReviewProposals() {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

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

        if (!proposals){
            return (
                <div className="filtered-proposals review-proposals">
                    <h2>Proposals Under Review</h2>
                    <p>There are currently no proposals to review.</p>
                </div>
            )
        } else {
            return (
                <div className="filtered-proposals review-proposals">
                    <h2>Proposals Under Review</h2>
                    {proposals.map((proposal) =>
                    <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                </div>
            );
        }
    }