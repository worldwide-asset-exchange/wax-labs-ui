import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";
import RenderProposalFilter from "./ProposalFilter.js";

export default function RenderMyDraftProposals(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    useEffect(() => {
        async function getMyDraftProposals() {
        try {
            let draftResp = await wax.rpc.get_table_rows({             
                  code: 'labs',
                  scope: 'labs',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'drafting',
                  upper_bound: 'drafting',
                  key_type: 'name'
              });
            
            
            if (!draftResp.rows.length) {
                return null
            } else {
                setProposals(draftResp.rows);
            }  
             
            } catch(e) {
              console.log(e);
            }
        }
        getMyDraftProposals();
        }, [wax.rpc]);

    
        if (!proposals){
            return (
                <div className="proposals-body">
                    <RenderProposalFilter />
                    <div className="filtered-proposals my-drafts">
                        <h2>Draft Proposals</h2>
                        <p>You do not have any saved draft proposals.</p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="proposals-body">
                    <RenderProposalFilter />
                    <div className="filtered-proposals my-drafts">
                        <h2>Draft Proposals</h2>
                        {proposals.filter(proposal => proposal.proposer === props.accountName).map((filteredProposal) =>
                        <RenderProposalGrid proposal={filteredProposal} key={filteredProposal.proposal_id} />)}
                    </div>
                </div>
            );
        }
    }