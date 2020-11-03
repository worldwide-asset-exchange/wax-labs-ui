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
    const [deliverables, setDeliverables ] = useState([]);
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

                            
                                    delivsResp.rows.forEach(function (element) {
                                        element.proposal_id = inProgProposal.proposal_id;
                                        element.deliverable_id_readable = element.deliverable_id;
                                        element.deliverable_id = inProgProposal.proposal_id+'.'+element.deliverable_id;
                                        element.proposal_title = inProgProposal.title;
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

    console.log(deliverables);

    async function approveDeliverable(deliverable){
        try {
           await activeUser.signTransaction({
               actions: [
                   {
                       account: 'labs',
                       name: 'reviewdeliv',
                       authorization: [{
                           actor: activeUser.accountName,
                           permission: 'active',
                       }],
                       data: {
                           proposal_id: deliverable.proposal_id,
                           deliverable_id: deliverable.deliverable_id_readable,
                           accept: true,
                           memo: ''
                       },
                   },
               ]} , {
               blocksBehind: 3,
               expireSeconds: 30
           });
        } catch(e){
            console.log(e);
        }
    }

    async function rejectDeliverable(deliverable){
        try {
           await activeUser.signTransaction({
               actions: [
                   {
                       account: 'labs',
                       name: 'reviewdeliv',
                       authorization: [{
                           actor: activeUser.accountName,
                           permission: 'active',
                       }],
                       data: {
                           proposal_id: deliverable.proposal_id,
                           deliverable_id: deliverable.deliverable_id_readable,
                           accept: false,
                           memo: ''
                       },
                   },
               ]} , {
               blocksBehind: 3,
               expireSeconds: 30
           });
        } catch(e){
            console.log(e);
        }
    }
    
    if (props.activeUser && deliverables) {
        return (
            <div className="deliverables">
                <div className="deliverables-menu">
                    <h3>Active Proposals</h3>
                    <ul>
                        <li><Link to="/deliverables">Deliverables</Link></li>
                        <li><Link to="assigned">Assigned to Me</Link></li>
                    </ul>
                </div>
                <div className="deliverables-body">
                    <Routes>
                        <Route path="/" element={<RenderDeliverablesInReview activeUser={props.activeUser} isAdmin={props.isAdmin} deliverables={deliverables} approveDeliverable={approveDeliverable} rejectDeliverable={rejectDeliverable} />} />
                        <Route path="assigned" element={<RenderAssignedDeliverables activeUser={props.activeUser} isAdmin={props.isAdmin} deliverables={deliverables} approveDeliverable={approveDeliverable} rejectDeliverable={rejectDeliverable} />} />
                    </Routes>
                </div>
            </div>
        );
    } else {
        return (
            <div className="deliverables">
                <div className="deliverables-menu">
                    <h3>Active Proposals</h3>
                    <ul>
                        <li><Link to="/deliverables">Deliverables</Link></li>
                        <li><Link to="assigned">Assigned to Me</Link></li>
                    </ul>
                </div>
                <div className="deliverables-body">
                    <Routes>
                        <Route path="/" element={<RenderDeliverablesInReview isAdmin={props.isAdmin} approveDeliverable={approveDeliverable} rejectDeliverable={rejectDeliverable} />} />
                        <Route path="assigned" element={<RenderAssignedDeliverables isAdmin={props.isAdmin} approveDeliverable={approveDeliverable} rejectDeliverable={rejectDeliverable} />} />
                    </Routes>
                </div>
            </div>
        );
    }
}