import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

export default function RenderArchivedProposals() {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    useEffect(() => {
        async function getArchivedProposals() {
        try {
            let completedResp = await wax.rpc.get_table_rows({             
                  code: 'labs',
                  scope: 'labs',
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
                const rejected = rejectedResp.rows;
                setProposals(prevState => {
                    return { ...prevState, rejected }
                  }); 
            }
            
            } catch(e) {
              console.log(e);
            }
        }
        getArchivedProposals();
        }, [wax.rpc]);

        if (!proposals){
            return (
                <div className="filtered-proposals archived">
                    <h2>Archived Proposals</h2>
                    <p>There are currently no archived proposals.</p>
                </div>
            );
        } else {
            return (
                <div className="filtered-proposals archived">
                    <h2>Archived Proposals</h2>
                    {proposals.map((proposal) =>
                    <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                </div>
            );
        }
    }