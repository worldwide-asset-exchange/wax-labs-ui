import React, { useState } from 'react';
import {
Link
} from 'react-router-dom';


export default function RenderDeliverableGrid(props){
    const [show_approval_pane, setApprovalVis] = useState(false);
    const [memo, setMemo] = useState('');
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
                           memo: memo
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
                           memo: memo
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

    function handleInputChange(event) {
        const value = event.target.value;

        setMemo(prevState => {
            return { ...prevState, memo: value }
          }
        );
    }

    function toggleReviewDeliverable(){
        setApprovalVis(!show_approval_pane) && setMemo('');
    }
    
    return (
        <div className="deliverables-grid-single">
            <div className="image">
                <img src="https://via.placeholder.com/245x90?text=Cover+Image"  />
            </div>
            <div className="information">
                <h4><Link to={"/proposals/" + deliverable.proposal_id}>{deliverable.proposal_title}</Link> <span className="category">(Deliverable #{deliverable.deliverable_id_readable})</span></h4>
                <span className="description"><em>{deliverable.description}</em></span><br />
                <a href={deliverable.report} target="_blank">View Deliverable</a>
            </div>
            <div className="actions">
                {/* !show_approval_pane ?
                <>
                <button className="btn" onClick={toggleReviewDeliverable}>Review</button>
                </>
                :
                <>
                <button className="btn" onClick={toggleReviewDeliverable}>X</button>
                </>
                */}
                <Link className="btn" to={"/proposals/"+ deliverable.proposal_id}>View Proposal</Link>
                <div className={show_approval_pane ? "approval-pane" : "approval-pane hide"}>
                    <input type="text" name="memo" onChange={handleInputChange} />
                    <button className="btn" onClick={approveDeliverable}>Approve</button>
                    <button className="btn" onClick={rejectDeliverable}>Reject</button>
                </div>
            </div>
        </div>
    );
}