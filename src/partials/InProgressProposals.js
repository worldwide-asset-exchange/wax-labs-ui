import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

export default function RenderInProgressProposals() {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    useEffect(() => {
        async function getInProgressProposals() {
        try {
            let inprogResp = await wax.rpc.get_table_rows({             
                  code: 'labs',
                  scope: 'labs',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'in.progress',
                  upper_bound: 'in.progress',
                  key_type: 'name'
              });
            
            
            if (!inprogResp.rows.length) {
                return null
            } else {
                setProposals(inprogResp.rows);
            }  
             
            } catch(e) {
              console.log(e);
            }
        }
        getInProgressProposals();
        }, [wax.rpc]);

        if (!proposals){
            return (
                <div className="filtered-proposals in-progress">
                    <h2>Active Proposals: In Progress</h2>
                    <p>There are currently no proposals in progress.</p>
                </div>
            );
        } else {
            return (
                <div className="filtered-proposals in-progress">
                    <h2>Active Proposals: In Progress</h2>
                    {proposals.map((proposal) =>
                    <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                </div>
            );
        }
    }