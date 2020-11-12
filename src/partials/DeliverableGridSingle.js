import React from 'react';
import {
Link
} from 'react-router-dom';


export default function RenderDeliverableGrid(props){
    const deliverable = props.deliverable;
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
    
    return (
        <div className="proposal-grid-single">
            <div className="information">
                Proposal: <Link to={"/proposals/" + deliverable.proposal_id}>{deliverable.proposal_title}</Link>
                Deliverable: {deliverable.deliverable_id_readable}
                {deliverable.description}
                <a href={deliverable.report} target="_blank">View Deliverable</a>
            </div>
            <div className="actions">
                <button className="btn" onClick={approveDeliverable}>Approve</button>
                <button className="btn" onClick={rejectDeliverable}>Reject</button>
                <Link className="btn" to={"/proposals/"+ deliverable.proposal_id}>View Proposal</Link>
            </div>
        </div>
    );
}