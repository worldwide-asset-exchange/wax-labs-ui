import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";
import RenderProposalFilter from "./ProposalFilter.js";

export default function RenderRejectedProposals(){
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    useEffect(() => {
        async function getRejectedProposals() {
        try {
            let rejectedResp = await wax.rpc.get_table_rows({             
                  code: 'labs',
                  scope: 'labs',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'cancelled',
                  upper_bound: 'cancelled',
                  key_type: 'name'
              });
            
            
            if (!rejectedResp.rows.length) {
                return null
            } else {
                setProposals(rejectedResp.rows);
            }  
             
            } catch(e) {
              console.log(e);
            }
        }
        getRejectedProposals();
        }, [wax.rpc]);


        if (!proposals){
            return (
                <div className="proposals-body">
                    <RenderProposalFilter />
                    <div className="filtered-proposals rejected">
                        <h3>Archived Proposals: Rejected</h3>
                        <p>There are currently no rejected proposals.</p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="proposals-body">
                    <RenderProposalFilter />
                    <div className="filtered-proposals rejected">
                        <h3>Archived Proposals: Rejected</h3>
                        {proposals.map((proposal) =>
                        <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                    </div>
                </div>
            );
        }
    }