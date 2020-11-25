import React, { useState } from 'react';
import {
Link
} from 'react-router-dom';
import Modal from 'react-modal';


export default function RenderDeliverableGrid(props){
    // eslint-disable-next-line 
    const [show_approval_pane, setApprovalVis] = useState(false);
    const [memo, setMemo] = useState('');
    const [modalIsOpen,setIsOpen] = React.useState(false);
    const deliverable = props.deliverable;
    const activeUser = props.activeUser;

    const customModalStyles = {
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)'
        }
      };
    
    Modal.setAppElement('#root');
    
    function openModal() {
      setIsOpen(true);
    }
  
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
    }
  
    function closeModal(){
      setIsOpen(false);
    }

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

    // function toggleReviewDeliverable(){
    //     setApprovalVis(!show_approval_pane) && setMemo('');
    // }
    
    return (
        <div className="deliverables-grid-single">
            <div className="image">
<<<<<<< HEAD
                <img src="https://via.placeholder.com/245x245?text=Cover+Image"  />
=======
                <img src="https://via.placeholder.com/245x90?text=Cover+Image"  alt="Cover thingy" />
>>>>>>> 0ddfb6e098abc7af894df9b2c3f782ab5efb8e98
            </div>
            <div className="information">
                <h4><Link to={"/proposals/" + deliverable.proposal_id}>{deliverable.proposal_title}</Link> <span className="category">(Deliverable #{deliverable.deliverable_id_readable})</span></h4>
                <span className="description"><em>{deliverable.description}</em></span><br />
                <a href={deliverable.report} target="_blank"  rel="noopener noreferrer">View Deliverable</a>
            </div>
            <div className="actions">
                <button className="btn" onClick={openModal}>Review</button>
                <Link className="btn" to={"/proposals/"+ deliverable.proposal_id}>View Proposal</Link>
                <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customModalStyles}
                        contentLabel="Deliverable Approval Panel"
                        >
                    <div className="approval-pane">
                        <button className="btn" onClick={closeModal}>X</button>
                        <input type="text" name="memo" onChange={handleInputChange} />
                        <button className="btn" onClick={approveDeliverable}>Approve</button>
                        <button className="btn" onClick={rejectDeliverable}>Reject</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}