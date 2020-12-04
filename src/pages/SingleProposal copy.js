import React, { useState, useEffect} from 'react';
import {
Link,
useParams,
// useNavigate
} from 'react-router-dom';
import Modal from 'react-modal';
import moment from 'moment';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderSingleProposal(props){
    const { id } = useParams();
    const activeUser = props.activeUser;
    const [ proposal, setProposal ] = useState({
        proposer: '',
        category: '',
        status: '',
        title: '',
        description: '',
        content: '',
        total_requested_funds: 0,
        remaining_funds: 0,
        deliverables: 0,
        deliverables_completed: 0,
        reviewer: '',
        ballot_name: '',
        ballot_results: []
    });
    // eslint-disable-next-line
    const [ profile, setProfile ] = useState({
        full_name: '',
        country: '',
        bio: '',
        image_url: '',
        website: '',
        contact: ''
    });
    const [deliverables, setDeliverables ] = useState([]);
    const [currentVotes, setVotes ] = useState([]);
    const [reviewer, setReviewer] = useState('');
    const [new_deliv, setNewDeliverable] = useState({
        requested_amount: '',
        recipient: ''
    });
    const [new_deliverable_report, setReportUrl] = useState('');
    const [show_new_deliverable, showNewDeliverable] = useState(false);
    const [end_time, setEndTime] = useState('');
    const new_deliverable_id = deliverables.length + 1;
    const votingEndsIn = moment(end_time, "YYYY-MM-DDTHH:mm:ss[Z]").parseZone().fromNow();
    const readableEndTime = moment(end_time).format("MMMM Do, YYYY [at] h:mm:ss a [UTC]");
    const [reviewerModalIsOpen,setReviewerIsOpen] = React.useState(false);
    const [reviewalModalIsOpen,setReviewalIsOpen] = React.useState(false);
    const [deliverablesEditModalIsOpen,setDeliverablesEditIsOpen] = React.useState(false);
    const [deliverablesReportModalIsOpen,setDeliverablesReportIsOpen] = React.useState(false);
    console.log(end_time);
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
    
    function openReviewerModal() {
        setReviewerIsOpen(true);
    }
  
    function closeReviewerModal(){
        setReviewerIsOpen(false);
    }

    function openReviewalModal() {
        setReviewalIsOpen(true);
    }
    
      function closeReviewalModal(){
        setReviewalIsOpen(false);
    }

    function openDeliverablesReportModal() {
        setDeliverablesReportIsOpen(true);
    }
    
    function closeDeliverablesReportModal(){
        setDeliverablesReportIsOpen(false);
      }

    function openDeliverablesEditModal() {
        setDeliverablesEditIsOpen(true);
    }
    
    function closeDeliverablesEditModal(){
        setDeliverablesEditIsOpen(false);
    }


  
   

     

  



    async function newDeliverable(){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'newdeliv',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            deliverable_id: deliverables.length + 1,
                            requested_amount: new_deliv.requested_amount,
                            recipient: new_deliv.recipient
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

    function toggleNewDeliverable(){
        showNewDeliverable(!show_new_deliverable);
    }

    function handleInputChange(event) {
                const value = event.target.value;
                const name = event.target.name;
                const targetId = event.target.id;

                if (targetId.includes('new-deliverable')){
                    setNewDeliverable(prevState => {
                        return {...prevState, [name]: value}
                    })
                } else if (targetId.includes('edit')){
                    setDeliverables(prevState => {
                        return {...prevState, [name]: value}
                    })
                } else if (name.includes('reviewer_name')){
                    setReviewer(prevState => {
                        return {...prevState, [name]: value}
                    });
                    console.log(reviewer);
                } else if (targetId.includes('report')){
                setReportUrl(prevState => {
                    return {...prevState, report: value}
                });
                console.log(new_deliverable_report.report);
            }
        }

    function RenderDynamicBreadcrumbs(){
        if (props.fromProposals) {
            return (
                <div>
                    <button>{'< Back to Proposals'}</button>
                </div>
            );
        } else {
            return null;
        }
    }
     

   
    
    function RenderDeliverables(){

        if (proposal.status === "inprogress"){ 
            return (
                <>
                {deliverables.map((deliverable) =>
                    <RenderSingleDeliverable key={deliverable.deliverable_id} deliverable_id={deliverable.deliverable_id} review_options={deliverable.review_options} editable={deliverable.editable} report_editable={deliverable.report_editable} recipient={deliverable.recipient} report={deliverable.report} requested={deliverable.requested} review_time={deliverable.review_time} status={deliverable.status} isAdmin={props.isAdmin} />)}
                </>
            );
        } else {
            return null;
        }
    } 

    function RenderSingleDeliverable(deliverable){

        async function deleteDeliverable(){
            try {
               await activeUser.signTransaction({
                   actions: [
                       {
                           account: 'labs',
                           name: 'rmvdeliv',
                           authorization: [{
                               actor: activeUser.accountName,
                               permission: 'active',
                           }],
                           data: {
                               proposal_id: id,
                               deliverable_id: deliverable.deliverable_id
                           },
                       },
                   ]} , {
                   blocksBehind: 3,
                   expireSeconds: 30
               });
               console.log("success");
            } catch(e){
                console.log(e);
            }
        }
   // eslint-disable-next-line
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
                              proposal_id: id,
                              deliverable_id: deliverable.deliverable_id,
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
   // eslint-disable-next-line
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
                              proposal_id: id,
                              deliverable_id: deliverable.deliverable_id,
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

       async function claimFunds() {
        try {        
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'claimfunds',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            deliverable_id: deliverable.deliverable_id
                        },
                    },
                    {
                        account: 'labs',
                        name: 'withdraw',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            account_owner: activeUser.accountName,
                            quantity: deliverable.requested
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
        } catch(e) {
            console.log(e);
        }
    }

        async function submitReport(){
            console.log("deliverable id: " + deliverable.deliverable_id)
            try {
                await activeUser.signTransaction({
                    actions: [
                        {
                            account: 'labs',
                            name: 'submitreport',
                            authorization: [{
                                actor: activeUser.accountName,
                                permission: 'active',
                            }],
                            data: {
                                proposal_id: id,
                                deliverable_id: deliverable.deliverable_id,
                                report: new_deliverable_report.report
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

        function RenderReadableDeliverableStatus() {
            if (deliverable.status){
                if (deliverable.status === "drafting"){
                    return <span>Draft</span>
                } else if (deliverable.status === "submitted") {
                    return <span>In Review</span>
                } else if (deliverable.status === "approved") {
                    return <span>Approved</span>
                } else if (deliverable.status === "claimed") {
                    return <span>Claimed</span>
                } else if (deliverable.status === "cancelled") {
                    return <span>Cancelled</span>
                } else if (deliverable.status === "reported") {
                    return <span>Reported</span>
                } else if (deliverable.status === "inprogress") { 
                    return <span>In Progress</span>
                } else {
                    return null
                }
            } else {
                return null;
            }
        }

        // function deliverableReviewerDecision(){
        //     const newDelivState = [...deliverables];
        //     const index = deliverable.deliverable_id - 1;
        //     if (deliverable.review_options !== undefined) {
        //     newDelivState[index] = {...newDelivState[index], review_options: !newDelivState[index].review_options}
        //     } else {
        //     newDelivState[index] = {...newDelivState[index], review_options: true}
        //     }
        //     setDeliverables(newDelivState);
        // }
        
        if (activeUser && activeUser.accountName === proposal.proposer) {
            const readableDeliverableAmount = deliverable.requested.slice(0,-13) + ' WAX';

            console.log(deliverable.report);
            return (
                <div className="single">
                    <div className="number"><h4>Deliverable {deliverable.deliverable_id}</h4></div>
                    <div className="amount">
                        <strong>Amount Requested:</strong> {readableDeliverableAmount}
                        <input type="text" id="edit-requested" className={!deliverable.editable ? 'hide': ''} name="new_requested_amount" onChange={handleInputChange} />
                    </div>
                    <div className="status"><strong>Status:</strong> <RenderReadableDeliverableStatus /></div>
                    <div className="recipient">
                        <strong>Recipient Account:</strong> {deliverable.recipient}
                        <input type="text" id="edit-recipient" className={!deliverable.editable ? 'hide': ''} name="new_recipient" onChange={handleInputChange} />
                    </div>
                    <div className="report">
                        {(deliverable.status === "inprogress" || deliverable.status === "completed" || deliverable.status === "rejected" || deliverable.status === "claimed" || deliverable.status === "reported") && deliverable.report ?
                        <>
                            {console.log(deliverable.report)}
                            <a href={"//" + deliverable.report} target="_blank" rel="noopener noreferrer">View Deliverable Report</a>
                        </>
                        :
                        <>
                            No Report Submitted
                        </>
                        }
                        
                    </div>
                    <div className="actions">
                        {deliverable.status === "inprogress" || deliverable.status === "reported"  || deliverable.status === "rejected" ?
                        <>
                            {!deliverable.editable && !deliverable.report_editable ?
                            <>
                            <button className="btn level-one" onClick={openDeliverablesReportModal}>Submit Report</button>
                            <button className="btn level-one" onClick={deleteDeliverable}>Delete</button>
                            </>
                            :
                            ''
                            }
                        </>
                        : deliverable.status === "accepted" ?
                        <>
                            <button className="btn" onClick={claimFunds}>Claim Funds</button>
                        </>
                        :
                        <>
                        </>
                        }
                    </div>
                    <Modal
                        isOpen={deliverablesEditModalIsOpen}
                        onRequestClose={closeDeliverablesReportModal}
                        style={customModalStyles}
                        contentLabel="Edit Deliverable Panel"
                        >
                        <div className="edit-panel">
                            <button className="btn" onClick={closeDeliverablesEditModal}>X</button>
                            <button className="btn" onClick={openDeliverablesEditModal}>Submit Report</button>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={deliverablesReportModalIsOpen}
                        onRequestClose={closeDeliverablesReportModal}
                        style={customModalStyles}
                        contentLabel="Report Panel"
                        >
                        <div className="submit-report-panel">
                            <button className="btn" onClick={closeDeliverablesReportModal}>X</button>
                            <input type="text" autoFocus id="submit-report" name="report" value={new_deliverable_report.report} onChange={handleInputChange} />
                            <button className="btn level-two" onClick={submitReport}>Submit</button>
                        </div>
                    </Modal>
                </div>
            );
        } else {
            const readableDeliverableAmount = deliverable.requested.slice(0,-13) + ' WAX';
            return (
                <div className="single">
                    <div className="number">Deliverable {deliverable.deliverable_id}</div>
                    <div className="amount">
                        <strong>Amount Requested:</strong> {readableDeliverableAmount}
                        <input type="text" id="edit-requested" className={!deliverable.editable ? 'hide': ''} name="new_requested_amount" onChange={handleInputChange} />
                    </div>
                    <div className="status">Status: <RenderReadableDeliverableStatus /></div>
                    <div className="recipient">
                        <strong>Recipient Account:</strong>{deliverable.recipient}
                        <input type="text" id="edit-recipient" className={!deliverable.editable ? 'hide': ''} name="new_recipient" onChange={handleInputChange} />
                    </div>
                    <div className="report">
                        {deliverable.status !== "drafting" ?
                        <>
                            <a href={"//" + deliverable.report} target="_blank" rel="noopener noreferrer">View Deliverable Report</a>
                        </>
                        :
                        <>
                            No Report Submitted
                        </>
                        }
                        <input type="text" autoFocus id="submit-report" className={!deliverable.report_editable ? 'hide': ''} name="report" value={new_deliverable_report.report} onChange={handleInputChange} />
                    </div>
                </div>
            );
        }
    }

    function RenderAdminMenu(){
        if (props.isAdmin === true && proposal.status !== "completed"){
            return (
                <div className="admin-menu backend-menu">
                    <h3>Admin Menu</h3>
                    <div>
                    {proposal.status === "submitted" ?
                    <>
                    <button className="btn" onClick={openReviewalModal}>Review</button>
                    </>
                    :
                    ''
                    }
                    { proposal.status !== "cancelled" ?
                    <>
                    <button className="btn" onClick={openReviewerModal}>Set Reviewer</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    </>
                    :
                    ''
                    }
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                    </div>
                    <Modal
                        isOpen={reviewalModalIsOpen}
                        onRequestClose={closeReviewalModal}
                        style={customModalStyles}
                        contentLabel="Reviewal Panel"
                        >
                    <div className="reviewal-panel">
                            <button className="modal-close" onClick={closeReviewalModal}>X</button>
                            <textarea onChange={handleInputChange} name="memo"></textarea>
                            { proposal.status === "submitted" ?
                            <>
                            <button className="btn" onClick={approveProposal} >Approve Proposal</button>
                            </>
                            :
                            ''
                            }
                            { proposal.status === "submitted" && proposal.status !== "cancelled" ?
                            <>
                            <button className="btn" onClick={rejectProposal} >Reject Proposal</button>
                            </>
                            :
                            ''
                            }
                    </div>
                    </Modal>
                    <Modal
                        isOpen={reviewerModalIsOpen}
                        onRequestClose={closeReviewerModal}
                        style={customModalStyles}
                        contentLabel="Reviewer Panel"
                        >
                        <div className="new-reviewer-panel">
                            <button className="close" onClick={closeReviewerModal}>X</button>
                            <div>
                                <strong>Set Reviewer</strong>
                                <p>The reviewer is the account that evaluates the quality of deliverables.</p>
                            </div>
                            <input type="text" autoFocus name="reviewer_name" value={reviewer.reviewer_name} onChange={handleInputChange} />
                            <button className="btn" onClick={newReviewer}>Submit</button>
                        </div>
                    </Modal>
                </div>
            );
        } else {
            return null;
        }
    }

    function RenderReviewerMenu(){
        if (activeUser && activeUser.accountName === proposal.reviewer && proposal.status === "submitted"){
            return (
                <div className="reviewer-menu backend-menu">
                    <h3>Reviewer Menu</h3>
                    <button className="btn" onClick={approveProposal} >Approve Proposal</button>
                    <button className="btn" onClick={rejectProposal} >Reject Proposal</button>
                </div>
            );
        } else {
            return null;
        }
    }

    

    return (
        <div className="single-proposal">
            <div className="proposal-header">
                <RenderDynamicBreadcrumbs />
                <div className="backend-menus">
                    <RenderAdminMenu />
                    <RenderReviewerMenu />
                    <RenderProposerMenu />
                </div>
                <div className="header-image"><img src="https://via.placeholder.com/980x360?text=Cover+Image" alt="Cover" /></div>
                <h2>{proposal.title} - <span className="category">{proposal.category}</span></h2>
                <p className="short-description"><em>{proposal.description}</em></p>
                <div className="core-information">
                    <div className="row">
                        <div className="left-col"><strong>Submitted by:</strong> <Link to={'/account/' + proposal.proposer}>{proposal.proposer}</Link></div>
                        <div className="right-col"><strong>Reviewer:</strong> {proposal.reviewer}</div>
                    </div>
                    <div className="row">
                        <div className="left-col"><strong>Status:</strong> <RenderReadableProposalStatus /></div>
                        <div className="right-col"><strong>Total Requested Funds: </strong>{readableAmount}</div>
                    </div>
                </div>
            </div>
            <div className="proposal-body">
                <div className="proposal-content">
                    <strong>Description:</strong>
                    <p>{proposal.content}</p>
                </div>
                {proposal.status !== "drafting" ?
                <div className="voting">
                    <RenderVoteTotals />
                    <RenderVoteButtons />
                    <strong>Voting {votingEndsIn.includes('ago') ? 'ended:' : 'ends:' }</strong> {votingEndsIn} on {readableEndTime}
                </div>
                :
                ''
                }
            </div>
            <div className="deliverables">
                <h3>Deliverables</h3>
                <p>{proposal.deliverables_completed} / {proposal.deliverables} completed</p>
                <RenderDeliverables />
                <div className={show_new_deliverable ? 'new-deliverable' : 'new-deliverable hide'}>
                    <h3>New Deliverable ({new_deliverable_id})</h3>
                    <div className="row">
                        <strong>Requested Amount:</strong>
                        <input id="new-deliverable-requested_amount" type="text" name="requested_amount" value={new_deliv.requested_amount} onChange={handleInputChange} />
                    </div>
                    <div className="row">
                        <strong>Recipient:</strong>
                        <input id="new-deliverable-recipient" type="text" name="recipient" value={new_deliv.recipient} onChange={handleInputChange} />
                    </div>
                    <div className="row">
                        <button className="btn" onClick={newDeliverable}>Submit</button>
                        <button className="btn" onClick={toggleNewDeliverable}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}