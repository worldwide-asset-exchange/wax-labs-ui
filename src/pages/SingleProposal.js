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
    const [show_new_reviewer, showNewReviewer] = useState(false);
    const [show_reviewal_pane, setReviewalPaneVis] = useState(false);
    const [end_time, setEndTime] = useState('');
    const new_deliverable_id = deliverables.length + 1;
    const votingEndsIn = moment(end_time, "YYYY-MM-DDTHH:mm:ss[Z]").fromNow();
    const readableEndTime = moment(end_time).format("MMMM d, YYYY [at] h:mm:ss a [UTC]");
    const [modalIsOpen,setIsOpen] = React.useState(false);

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


    useEffect(() => {
        async function getProposal() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                    code: 'labs',
                    scope: 'labs',
                    table: 'proposals',
                    json: true,
                    lower_bound: id,
                    upper_bound: id,
                });

                setProposal(resp.rows[0]);

                const proposerAcct = resp.rows[0].proposer;
                const ballotName = resp.rows[0].ballot_name;
                const status = resp.rows[0].status;
                
                async function getVotes(){
                    try {
                        let profile = await wax.rpc.get_table_rows({             
                           code: 'labs',
                           scope: 'labs',
                           table: 'profiles',
                           json: true,
                           lower_bound: proposerAcct,
                           upper_bound: proposerAcct,
                       });
           
                       console.log(profile.rows[0]);
                       setProfile(profile.rows[0]);
           
                        let currentVote = await wax.rpc.get_table_rows({             
                           code: 'decide',
                           scope: 'decide',
                           table: 'ballots',
                           json: true,
                           lower_bound: ballotName,
                           upper_bound: ballotName,
                           limit: 1
                       });

                       const yes_votes = currentVote.rows[0].options.filter(option => option.key === "yes");

                       const end_time = currentVote.rows[0].end_time;
                       
                       console.log(yes_votes);
                       setEndTime(end_time);
                       setVotes(currentVote.rows[0].options);

                       if (status === "inprogress"){
                        let delivs = await wax.rpc.get_table_rows({
                                    code: 'labs',
                                    scope: id,
                                    table: 'deliverables',
                                    json: true,
                                });
                                console.log(delivs.rows);
                                setDeliverables(delivs.rows);
                            } else {
                                return null;
                            }

                    } catch(e) {
                       console.log(e);
                    }
                }
                getVotes();
                } catch(e) {
                    console.log(e);
            }
        }
        getProposal();
    }, [id, proposal.proposer]);
    

     async function castVote(event) {
        const voteOption = event.target.name;
        try {
            let checkReg = await wax.rpc.get_table_rows({             
                code: 'decide',
                scope: activeUser.accountName,
                table: 'voters',
                json: true
            });
            if (!checkReg.rows.length){
                await activeUser.signTransaction({
                    actions: [
                        {
                            account: 'oig',
                            name: 'regvoter',
                            authorization: [{
                                actor: activeUser.accountName,
                                permission: 'active',
                            }],
                            data: {
                                voter: activeUser.accountName,
                                treasury_symbol: '8,VOTE',
                            },
                        },
                        {
                            account: 'decide',
                            name: 'sync',
                            authorization: [{
                                actor: activeUser.accountName,
                                permission: 'active',
                            }],
                            data: {
                                voter: activeUser.accountName,
                                },
                            },
                        {
                            account: 'decide',
                            name: 'castvote',
                                authorization: [{
                                    actor: activeUser.accountName,
                                    permission: 'active',
                                }],
                            data: {
                                voter: activeUser.accountName,
                                options: [voteOption],
                                ballot_name: proposal.ballot_name
                                },
                            }
                        ]}, {
                            blocksBehind: 3,
                            expireSeconds: 30
                        });
                    } else {
                        await activeUser.signTransaction({
                            actions: [
                                {
                                    account: 'decide',
                                    name: 'sync',
                                    authorization: [{
                                        actor: activeUser.accountName,
                                        permission: 'active',
                                    }],
                                    data: {
                                        voter: activeUser.accountName,
                                        },
                                    },
                                {
                                    account: 'decide',
                                    name: 'castvote',
                                        authorization: [{
                                            actor: activeUser.accountName,
                                            permission: 'active',
                                        }],
                                    data: {
                                        voter: activeUser.accountName,
                                        options: [voteOption],
                                        ballot_name: proposal.ballot_name
                                        },
                                    }
                                ]}, {
                                    blocksBehind: 3,
                                    expireSeconds: 30
                                });
                    }
                } catch(e) {
                    console.log(e);
            }
        }  

    async function rejectProposal() {
        try {      
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'reviewprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            approve: false,
                            memo: ''
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

     async function approveProposal() {
        try { 
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'reviewprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            approve: true,
                            memo: ''
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

     async function cancelProposal() {
        try {        
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'cancelprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            memo: ''
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

     async function deleteProposal() {
        try {        
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'deleteprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
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

     async function endVoting() {
        try {        
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'endvoting',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
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

     async function beginVoting() {
        try {    
            let resp = await wax.rpc.get_table_rows({             
                code: 'labs',
                scope: activeUser.accountName,
                table: 'accounts',
                json: true,
                limit: 1
            });

            const balance = resp.rows[0].balance;
            const amount = balance.replace(' WAX', '');
        
            if (amount >= 10.00000000){
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'beginvoting',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            ballot_name: 'wlabs' + id,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            } else {
                await activeUser.signTransaction({
                    actions: [
                        {
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: activeUser.accountName,
                                permission: 'active',
                            }],
                            data: {
                                from: activeUser.accountName,
                                to: 'labs',
                                quantity: '10.00000000 WAX',
                                memo: ''
                            },
                        },
                        {
                            account: 'labs',
                            name: 'beginvoting',
                            authorization: [{
                                actor: activeUser.accountName,
                                permission: 'active',
                            }],
                            data: {
                                proposal_id: id,
                                ballot_name: 'wlabs' + id,
                            },
                        }
                    ]} , {
                    blocksBehind: 3,
                    expireSeconds: 30
                });
            }     
        
        } catch(e) {
            console.log(e);
        }
     }

     async function submitEdits(deliverable){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'editvdeliv',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            deliverable_id: deliverable.deliverable_id,
                            new_requested_amount: deliverable.new_requested_amount,
                            new_recipient: deliverable.new_recipient
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

    async function newReviewer(deliverable){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'setreviewer',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            deliverable_id: 1,
                            new_reviewer: reviewer.reviewer_name
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

    function toggleNewReviewer(){
        showNewReviewer(!show_new_reviewer);
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
     

     function RenderVoteTotals(){

        return (
            <div className="vote-totals">
                <div className="yes-vote"><strong>Yes: {currentVotes.filter(({key}) => key === "yes").map(ele => ele.value.slice(0,-14))}</strong></div>
                <div className="no-vote"><strong>No: {currentVotes.filter(({key}) => key === "no").map(ele => ele.value.slice(0,-14))}</strong></div>
            </div>
        );
     }

     function RenderVoteButtons(){
        if (activeUser && proposal.status === "voting"){ 
            return (
                <div className="vote-buttons">
                    <button className="btn" name="yes" onClick={castVote}>Vote Yes</button>
                    <button className="btn" name="no" onClick={castVote}>Vote No</button>
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
                } else if (deliverable.status === "inprogress") { 
                    return <span>In Progress</span>
                } else {
                    return null
                }
            } else {
                return null;
            }
        }


        function makeEditable(){
            const newDelivState = [...deliverables];
            const index = deliverable.deliverable_id - 1;
            if (deliverable.editable !== undefined) {
            newDelivState[index] = {...newDelivState[index], editable: !newDelivState[index].editable, report_editable: false}
            } else {
            newDelivState[index] = {...newDelivState[index], editable: true, report_editable: false}
            }
            setDeliverables(newDelivState);
            console.log(deliverable.editable);
         }
         
         function makeEditableReport(){
            const newDelivState = [...deliverables];
            const index = deliverable.deliverable_id - 1;
            if (deliverable.report_editable !== undefined) {
            newDelivState[index] = {...newDelivState[index], report_editable: !newDelivState[index].report_editable, editable: false}
            } else {
            newDelivState[index] = {...newDelivState[index], report_editable: true, editable: false}
            }
            setDeliverables(newDelivState);
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
                        {(deliverable.status === "inprogress" || deliverable.status === "completed" || deliverable.status === "rejected" || deliverable.status === "claimed") && deliverable.report ?
                        <>
                            <a href={deliverable.report} target="_blank" rel="noopener noreferrer">View Deliverable Report</a>
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
                            <button className="btn level-one" onClick={openModal}>Submit Report</button>
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
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customModalStyles}
                        contentLabel="Edit Deliverable Panel"
                        >
                        <div className="edit-panel">
                            <button className="btn" onClick={closeModal}>Submit Report</button>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customModalStyles}
                        contentLabel="Report Panel"
                        >
                        <div className="submit-report-panel">
                            <button className="btn" onClick={closeModal}>X</button>
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
                            <a href={deliverable.report} target="_blank" rel="noopener noreferrer">View Deliverable Report</a>
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

    function toggleReviewProposal() {
        setReviewalPaneVis(!show_reviewal_pane);
    }

    function RenderAdminMenu(){
        if (props.isAdmin === true && proposal.status !== "completed"){
            return (
                <div className="admin-menu backend-menu">
                    <h3>Admin Menu</h3>
                    <div>
                    { proposal.status === "submitted" && show_reviewal_pane ?
                    <>
                    <button className="btn" onClick={toggleReviewProposal}></button>
                    </>
                    : proposal.status === "submitted" ?
                    <>
                    <button className="btn" onClick={toggleReviewProposal}>Review</button>
                    </>
                    :
                    ''
                    }
                    { proposal.status !== "cancelled" ?
                    <>
                    <button className="btn" onClick={openModal}>Set Reviewer</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    </>
                    :
                    ''
                    }
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                    </div>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customModalStyles}
                        contentLabel="Reviewal Panel"
                        >
                    <div className="reviewal-panel">
                            <button className="modal-close" onClick={closeModal}>X</button>
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
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customModalStyles}
                        contentLabel="Reviewer Panel"
                        >
                        <div className="new-reviewer-panel">
                            <button className="close" onClick={closeModal}>X</button>
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

    function RenderProposerMenu(){
        if (activeUser && activeUser.accountName === proposal.proposer && proposal.status === "drafting"){
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer Menu</h3>
                    <Link className="btn" to="edit">Edit Proposal</Link>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else if (activeUser && activeUser.accountName === proposal.proposer && proposal.status === "approved"){
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer Menu</h3>
                    <button className="btn" onClick={beginVoting} >Begin Voting</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else if (activeUser && activeUser.accountName === proposal.proposer && proposal.status === "voting"){
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer Menu</h3>
                    <button className="btn" onClick={endVoting}>End Voting</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else if (activeUser && activeUser.accountName === proposal.proposer && proposal.status !== "approved") {
            return (
                <div className="proposer-menu backend-menu">
                    <h3>Proposer Menu</h3>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else  {
            return null;
        }

    }

    function RenderReadableProposalStatus() {
        if (proposal.status){
            if (proposal.status === "drafting"){
                return <span>Draft</span>
            } else if (proposal.status === "submitted") {
                return <span>In Review</span>
            } else if (proposal.status === "approved") {
                return <span>Approved</span>
            } else if (proposal.status === "voting") {
                return <span>In Vote</span>
            } else if (proposal.status === "completed") {
                return <span>Complete</span>
            } else if (proposal.status === "cancelled") {
                return <span>Cancelled</span>
            } else if (proposal.status === "inprogress") { 
                return <span>In Progress</span>
            } else {
                return null
            }
        } else {
            return null;
        }
    }
    

    let readableAmount = '';

    if (proposal.total_requested_funds) {
        readableAmount = proposal.total_requested_funds.slice(0,-13) + ' WAX';
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