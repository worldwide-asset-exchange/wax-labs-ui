import React, { useState, useEffect} from 'react';
import {
Link,
useParams
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderSingleDeliverable(){
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const { id } = useParams();
    const [ proposal, setProposal ] = useState({
        proposer: '',
        category: '',
        status: '',
        title: '',
        description: '',
        content: '',
        total_requested_funds: 0.00000000,
        remaining_funds: 0.00000000,
        deliverables: 0,
        deliverables_completed: 0,
        reviewer: '',
        ballot_name: '',
        yes_votes: 0.00000000,
        not_votes: 0.00000000
    });

    useEffect(() => {
        async function getDeliverable() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs.decide',
                      scope: 'labs.decide',
                      table: 'proposals',
                      json: true,
                      lower_bound: id,
                      upper_bound: id,
                  });
                  setProposal(resp.rows[0]);
                } catch(e) {
                  console.log(e);
            }
        }
        getDeliverable();
     }, []);
    return (
        <div className="single-proposal">{id}{proposal.title}{proposal.description}{proposal.content}
        
        </div>
    );
}