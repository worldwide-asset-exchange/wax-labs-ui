import React, { useState, useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderDeliverableGrid from './DeliverableGridSingle.js';

export default function RenderAssignedDevliverables(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [deliverables, setDeliverables ] = useState([]);
    let total_proposals_check = 0;
    const activeUser = props.activeUser;

    useEffect(() => {
        async function getDeliverablesInReview(){
            try {
                let resp = await wax.rpc.get_table_rows({             
                    code: 'labs',
                    scope: 'labs',
                    table: 'proposals',
                    json: true,
                });
            
                if (!resp.rows.length) {
                    return null
                } else {
                    const total_proposals = resp.rows.length;
                    const stateArray = deliverables;
                        resp.rows.forEach(inProgProposal => {
                            async function getDelivs() {
                                try {
                                    if (total_proposals_check !== total_proposals){
                                        
                                        let delivsResp = await wax.rpc.get_table_rows({             
                                            code: 'labs',
                                            scope: inProgProposal.proposal_id,
                                            table: 'deliverables',
                                            json: true,
                                            primary_index: '',
                                            key_type: 'name',
                                            lower_bound: '',
                                            upper_bound: ''
                                        })

                                        delivsResp.rows.forEach(function (element) {
                                            element.proposal_id = inProgProposal.proposal_id;
                                            element.deliverable_id_readable = element.deliverable_id;
                                            element.deliverable_id = inProgProposal.proposal_id+'.'+element.deliverable_id;
                                            element.proposal_title = inProgProposal.title;
                                            element.reviewer = inProgProposal.reviewer;
                                          });
                                        

                                        let newArray = delivsResp.rows;

                                        Array.prototype.push.apply(stateArray, newArray); 

                                        total_proposals_check = total_proposals_check + 1;

                                    }  else if (total_proposals_check === total_proposals) {
                                        setDeliverables(stateArray);
                                    }
    
                                } catch(e) {
                                    console.log(e);
                                }
                                console.log(deliverables);
                        console.log(total_proposals_check);
                        }
                        getDelivs()
                    })
                }
            } catch(e) {
                console.log(e);
            }
        }
    getDeliverablesInReview();
    }, []);

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