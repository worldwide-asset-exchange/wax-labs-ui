import React, { useState, useEffect } from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

export default function RenderVotingProposals() {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    useEffect(() => {
        async function getVotingProposals() {
        try {
            let votingResp = await wax.rpc.get_table_rows({             
                  code: 'labs.decide',
                  scope: 'labs.decide',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'voting',
                  upper_bound: 'voting',
                  key_type: 'name'
              });
            
            
            if (!votingResp.rows.length) {
                return null
            } else {
                setProposals(votingResp.rows);
            }  
             
            } catch(e) {
              console.log(e);
            }
        }
            return getVotingProposals();
        }, []);

        if (!proposals){
            return (
                <div className="filtered-proposals review-proposals">
                    <h2>Active Proposals: In Vote</h2>
                    <p>There are currently no proposals to vote on.</p>
                </div>
            )
        } else {
            return (
                <div className="filtered-proposals voting">
                    <h2>Active Proposals: In Vote</h2>
                    {proposals.map((proposal) =>
                    <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                </div>
            );
        }
    }