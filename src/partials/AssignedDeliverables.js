import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderDeliverableGrid from './DeliverableGridSingle.js';

export default function RenderAssignedDevliverables(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [deliverables, setDeliverables ] = useState([]);
    const activeUser = props.activeUser;


    async function getDelivs(proposal) {
        try {                                      
            let delivsResp = await wax.rpc.get_table_rows({             
                code: 'labs',
                scope: proposal.proposal_id,
                table: 'deliverables',
                json: true,
                primary_index: '',
                key_type: 'name',
                lower_bound: '',
                upper_bound: ''
            })

            delivsResp.rows.forEach(function (element) {
                element.proposal_id = proposal.proposal_id;
                element.deliverable_id_readable = element.deliverable_id;
                element.deliverable_id = proposal.proposal_id+'.'+element.deliverable_id;
                element.proposal_title = proposal.title;
                element.reviewer = proposal.reviewer;
            });
    
            let delivs = delivsResp.rows;
            return delivs;
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        async function getDeliverablesInReview() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                    code: 'labs',
                    scope: 'labs',
                    table: 'proposals',
                    json: true,
                });
            
                if (!resp.rows.length) {
                    return null
                } 
                let stateArray = deliverables;
                console.log(stateArray);
                resp.rows.forEach(async(inProgProposal) => {
                    let delivs = await getDelivs(inProgProposal);
                    console.log(delivs);
                });
            } catch(e) {
                console.log(e);
            }
        }
    getDeliverablesInReview();
    }, [deliverables]);

    if (!deliverables || !props.activeUser){
        return (
            <div className="filtered-proposals archived">
                <h2>Assigned Deliverables to Review</h2>
                <p>There are currently no deliverables to review.</p>
            </div>
        );
    } else {
        return (
            <div className="filtered-proposals archived">
                <h2>Assigned Deliverables to Review</h2>
                {deliverables.filter(x => x.reviewer === props.activeUser.accountName).map((deliverable) =>
                <RenderDeliverableGrid deliverable={deliverable} key={deliverable.deliverable_id} activeUser={props.activeUser} />)}
            </div>
        );
    }
}