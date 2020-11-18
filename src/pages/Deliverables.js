import React, { useState, useEffect} from 'react';
import {
Routes,
Route,
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderDeliverablesInReview from '../partials/DeliverablesInReview.js';
import RenderAssignedDeliverables from '../partials/AssignedDeliverables.js';

export default function RenderDeliverables(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [deliverables, setDeliverables ] = useState();
    const activeUser = props.activeUser;

    useEffect(() => {
        async function getDeliverablesInReview(){
            try {
                let resp = await wax.rpc.get_table_rows({             
                    code: 'labs',
                    scope: 'labs',
                    table: 'proposals',
                    json: true,
                    index_position: 'fourth', //status
                    lower_bound: 'submitted',
                    upper_bound: 'submitted',
                    key_type: 'name'
                });
            
            
                if (!resp.rows.length) {
                    return null
                }
                
                let stateArray = [];

                resp.rows.forEach(inProgProposal => {
                            async function getDelivs() {
                                try {
                                    
                                    let delivsResp = await wax.rpc.get_table_rows({             
                                        code: 'labs',
                                        scope: inProgProposal.proposal_id,
                                        table: 'deliverables',
                                        json: true
                                    })

                            
                                    delivsResp.rows.sort().forEach(function (element) {
                                        element.proposal_id = inProgProposal.proposal_id;
                                        element.deliverable_id_readable = element.deliverable_id;
                                        element.deliverable_id = inProgProposal.proposal_id+'.'+element.deliverable_id;
                                        element.proposal_title = inProgProposal.title;
                                        element.description = inProgProposal.description;
                                        element.reviewer = inProgProposal.reviewer;
                                        stateArray = [...stateArray, element];
                                        setDeliverables(stateArray);
                                        });
                                    
                                } catch(e) {
                                    console.log(e);
                                }
                            
                        }
                        getDelivs()
                    });
            } catch(e) {
                console.log(e);
            }
        }
    getDeliverablesInReview();
    }, []);

    if (props.activeUser && deliverables != []) {
        return (
            <div className="deliverables">
                <h2>Deliverables</h2>
                <Routes>
                    <Route path="/" element={<RenderDeliverablesInReview status="all" activeUser={props.activeUser} isAdmin={props.isAdmin} deliverables={deliverables} />} />
                    <Route path="assigned" element={<RenderAssignedDeliverables status="assigned" activeUser={props.activeUser} isAdmin={props.isAdmin} deliverables={deliverables} />} />
                </Routes>
            </div>
        );
    } else {
        return (
            <div className="deliverables">
                <h2>Deliverables</h2>
                <Routes>
                    <Route path="/" element={<RenderDeliverablesInReview status="all" activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path="assigned" element={<RenderAssignedDeliverables status="assigned" activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                </Routes>
            </div>
        );
    }
}