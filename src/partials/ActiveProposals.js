import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

export default function RenderActiveProposals(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    useEffect(() => {
        async function getActiveProposals() {
        try {
            let votingResp = await wax.rpc.get_table_rows({             
                  code: 'labs',
                  scope: 'labs',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'voting',
                  upper_bound: 'voting',
                  key_type: 'name'
              });
            
              console.log(votingResp.rows);
            
            if (!votingResp.rows.length) {
                return null;
            } else {
                console.log(votingResp.rows);
                setProposals(votingResp.rows);
            }
            
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
                const inprog = inprogResp.rows;
                setProposals(prevState => {
                    return { ...prevState, inprog }
                  }); 
            }
            
            } catch(e) {
              console.log(e);
            }
        }
        getActiveProposals();
        }, []);

    if (!proposals){
        return (
            <div className="filtered-proposals active">
                <h2>Active Proposals</h2>
                <p>There are currently no active proposals.</p>
            </div>
        );
    } else {
        return (
            <div className="filtered-proposals active">
                <h2>Active Proposals</h2>
                {proposals.map((proposal) =>
                <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
            </div>
            );
        }
    }