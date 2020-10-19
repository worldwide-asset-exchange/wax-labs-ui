import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

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
                  lower_bound: 'rejected',
                  upper_bound: 'rejected',
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
        }, []);


        if (!proposals){
            return (
                <div className="filtered-proposals rejected">
                    <h2>Archived Proposals: Rejected</h2>
                    <p>There are currently no rejected proposals.</p>
                </div>
            )
        } else {
            return (
                <div className="filtered-proposals rejected">
                    <h2>Archived Proposals: Rejected</h2>
                    {proposals.map((proposal) =>
                    <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                </div>
            );
        }
    }