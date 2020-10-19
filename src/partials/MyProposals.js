import React, { useState, useEffect } from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

export default function RenderMyProposals() {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [proposals, setProposals ] = useState();

    useEffect(() => {
        async function getMyProposals() {
        try {
            let resp = await wax.rpc.get_table_rows({             
                code: 'labs',
                scope: 'labs',
                table: 'proposals',
                json: true,
                index_position: 'secondary',
                lower_bound: this.props.accountName,
                upper_bound: this.props.accountName,
                key_type: 'name'
            });
            
            
            if (!resp.rows.length) {
                return null
            } else {
                setProposals(resp.rows);
            }  
             
            } catch(e) {
              console.log(e);
            }
        }
        getMyProposals();
        }, []);

    if (!proposals){
        return (
            <div className="filtered-proposals my-proposals">
            <h2>My Proposals</h2>
            <p>You currently have no proposals. <Link to="/proposals/new">Create a proposal.</Link></p>
            </div>
        );
    } else {
        return (
            <div className="filtered-proposals my-proposals">
                <h2>My Proposals</h2>
                {this.state.proposals.map((proposal) =>
                <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
            </div>
        );
    }
}