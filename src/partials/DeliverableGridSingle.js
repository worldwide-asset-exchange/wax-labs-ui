import React from 'react';
import {
Link
} from 'react-router-dom';

import * as waxjs from "@waxio/waxjs/dist";


export default function RenderDeliverableGrid(props){
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const activeUser = props.activeUser;

    async function approveDeliverable(){
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

    async function rejectDeliverable(){
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

    const deliverable = props.deliverable;
    return (
        <div className="proposal-grid-single">
            Proposal ID: {deliverable.proposal_id}
            Title: {deliverable.proposal_title}
            Deliverable ID: {deliverable.deliverable_id_readable}
            <a href={deliverable.report} target="_blank">{deliverable.report}</a>
            <button className="btn" onClick={approveDeliverable }>Approve</button>
            <button className="btn" onClick={rejectDeliverable}>Reject</button>
            <Link className="btn" to={"/proposals/"+ deliverable.proposal_id}>View Proposal</Link>

        </div>
    );
}