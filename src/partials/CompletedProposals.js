import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

export default function RenderCompletedProposals() {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    useEffect(() => {
        async function getCompletedProposals() {
        try {
            let completedResp = await wax.rpc.get_table_rows({             
                  code: 'labs.decide',
                  scope: 'labs.decide',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'completed',
                  upper_bound: 'completed',
                  key_type: 'name'
              });
            
            
            if (!completedResp.rows.length) {
                return null
            } else {
                setProposals(completedResp.rows);
            }  
             
            } catch(e) {
              console.log(e);
            }
        }
            return getCompletedProposals();
        }, []);

    if (!proposals){
            return (
                <div className="filtered-proposals completed">
                    <h2>Active Proposals: Completed</h2>
                    <p>There are currently no completed proposals.</p>
                </div>
            );
        } else {
            return (
                <div className="filtered-proposals completed">
                    <h2>Archived Proposals: Completed</h2>
                    {proposals.map((proposal) =>
                    <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                </div>
            );
        }
    }