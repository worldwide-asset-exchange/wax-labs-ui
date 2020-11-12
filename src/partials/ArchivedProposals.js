import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";
import RenderProposalFilter from "./ProposalFilter.js";

export default function RenderArchivedProposals() {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    let proposalsArray = [];

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
            
            
            if (completedResp.rows.length) {
                completedResp.rows.forEach(function (element) {
                    proposalsArray = [...proposalsArray, element];
                    setProposals(proposalsArray);
                    });
            }
            
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

            if (rejectedResp.rows.length) {
                rejectedResp.rows.forEach(function (element) {
                    proposalsArray = [...proposalsArray, element];
                    setProposals(proposalsArray);
                    });
            }
            
            } catch(e) {
              console.log(e);
            }
        }
        getArchivedProposals();
        }, []);

        if (!proposals){
            return (
                <div className="proposals-body">
                    <RenderProposalFilter />
                    <div className="filtered-proposals archived">
                        <h2>Archived Proposals</h2>
                        <p>There are currently no archived proposals.</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="proposals-body">
                    <RenderProposalFilter />
                    <div className="filtered-proposals archived">
                        <h2>Archived Proposals</h2>
                        {proposals.map((proposal) =>
                        <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                    </div>
                </div>
            );
        }
    }