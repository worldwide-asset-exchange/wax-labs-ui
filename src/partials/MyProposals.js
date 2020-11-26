import React, { useState, useEffect } from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";
import RenderProposalFilter from "./ProposalFilter.js";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderMyProposals(props) {
    const [proposals, setProposals ] = useState(null);

    useEffect(() => {
        async function getMyProposals() {
        try {
            let resp = await wax.rpc.get_table_rows({             
                code: 'labs',
                scope: 'labs',
                table: 'proposals',
                json: true,
                index_position: 'secondary',
                lower_bound: props.accountName,
                upper_bound: props.accountName,
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
        }, [props.accountName]);

    if (!proposals){
        return (
            <div className="proposals-body">
                <h2>Proposals</h2>
                <RenderProposalFilter activeUser={props.activeUser} isAdmin={props.isAdmin} />
                <div className="filtered-proposals my-proposals">
                    <h3>My Proposals</h3>
                    <p>You currently have no proposals. <Link to="/proposals/new">Create a proposal.</Link></p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="proposals-body">
                <h2>Proposals</h2>
                <RenderProposalFilter activeUser={props.activeUser} isAdmin={props.isAdmin} />
                <div className="filtered-proposals my-proposals">
                    <h3>My Proposals</h3>
                    {proposals.map((proposal) =>
                    <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                </div>
            </div>
        );
    }
}