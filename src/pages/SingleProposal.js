import React, { useState, useEffect, useCallback} from 'react';
import {
Link,
useParams
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderSingleProposal(props){
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
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
    const [reviewer_name, setReviewer] = useState('');
    const [new_deliv, setNewDeliverable] = useState({
        requested_amount: '',
        recipient: ''
    });
    const [new_deliverable_report, setReportUrl] = useState('');
    const [show_new_deliverable, showNewDeliverable] = useState(false);
    const new_deliverable_id = deliverables.length + 1;

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

                       const yes_votes = currentVote.rows[0].options.filter(option => option.key === "yes").value;
                       
                       console.log(yes_votes);
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
                            deliverable_id: id
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
                            deliverable_id: deliverable.deliverable_id,
                            new_reviewer: reviewer_name
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
                } else if (targetId.includes('new_reviewer')){
                    setReviewer(prevState => {
                        return {...prevState, [name]: value}
                    });
                } else if (targetId.includes('report')){
                setReportUrl(prevState => {
                    return {...prevState, report: value}
                });
                console.log(new_deliverable_report.report);
            }
        }
     

     function RenderVoteTotals(){
        return (
            <div className="vote-totals">
                <div className="yes-vote"><strong>Yes: {currentVotes.filter(({key}) => key === "yes").map(ele => ele.value)}</strong></div>
                <div className="no-vote"><strong>No: {currentVotes.filter(({key}) => key === "no").map(ele => ele.value)}</strong></div>
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
                <div>
                {deliverables.map((deliverable) =>
                    <RenderSingleDeliverable key={deliverable.deliverable_id} deliverable_id={deliverable.deliverable_id} review_options={deliverable.review_options} editable={deliverable.editable} report_editable={deliverable.report_editable} recipient={deliverable.recipient} report={deliverable.report} requested={deliverable.requested} review_time={deliverable.review_time} status={deliverable.status} isAdmin={props.isAdmin} />)}
                </div>
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

        function deliverableReviewerDecision(){
            const newDelivState = [...deliverables];
            const index = deliverable.deliverable_id - 1;
            if (deliverable.review_options !== undefined) {
            newDelivState[index] = {...newDelivState[index], review_options: !newDelivState[index].review_options}
            } else {
            newDelivState[index] = {...newDelivState[index], review_options: true}
            }
            setDeliverables(newDelivState);
         }

        if (activeUser.accountName === proposal.reviewer && !props.isAdmin){
            return (
                <div className="single">
                    <div className="number">{deliverable.deliverable_id}</div>
                    <div className="amount">{deliverable.requested}</div>
                    <div className="status">{deliverable.status}</div>
                    {deliverable.status !== "drafting" ?
                    <div className="report"><a href={deliverable.report} target="_blank">Report</a></div>
                    :
                    <>
                    <div className="report">No Report Submitted</div>
                    </>
                    }
                    <div className="actions">
                        {deliverable.status === "drafting"  ?
                        <>
                            <button className="btn" onClick={deliverableReviewerDecision}>Review</button>
                        </>
                        :
                        <>
                        </>
                        }
                    </div>
                    <div className={!deliverable.review_options ? 'hide reviewer-options' : 'reviewer-options' }>
                        <input type="text" name="memo" onChange={handleInputChange} />
                        <button className="btn" onClick={approveDeliverable}>Approve</button>
                        <button className="btn" onClick={rejectDeliverable}>Reject</button> 
                    </div>
                

                </div>
            );
        } else if (activeUser.accountName === proposal.proposer) {
            return (
                <div className="single">
                    <div className="number">{deliverable.deliverable_id}</div>
                    <div className="amount">
                        {deliverable.requested}
                        <input type="text" id="edit-requested" className={!deliverable.editable ? 'hide': ''} name="new_requested_amount" onChange={handleInputChange} />
                    </div>
                    <div className="status">{deliverable.status}</div>
                    <div className="recipient">
                        {deliverable.recipient}
                        <input type="text" id="edit-recipient" className={!deliverable.editable ? 'hide': ''} name="new_recipient" onChange={handleInputChange} />
                    </div>
                    <div className="report">
                        {deliverable.status !== "drafting" ?
                        <>
                            <a href={deliverable.report} target="_blank">Report</a>
                        </>
                        :
                        <>
                            No Report Submitted
                        </>
                        }
                        <input type="text" autoFocus id="submit-report" className={!deliverable.report_editable ? 'hide': ''} name="report" value={new_deliverable_report.report} onChange={handleInputChange} />
                    </div>
                    <div className="actions">
                        {deliverable.status === "drafting" || deliverable.status === "submitted"  || deliverable.status === "rejected" ?
                        <>
                            {deliverable.editable ? 
                            <>
                            <button className="btn level-two" id={"submit-edits-" + deliverable.deliverable_id} onClick={submitEdits}>Submit</button>
                            <button className="btn level-two cancel" onClick={makeEditable}>X</button>
                            </>
                            : 
                            ''
                            }
                            {deliverable.report_editable ? 
                            <>
                            <button className="btn level-two" onClick={submitReport}>Submit</button>
                            <button className="btn level-two cancel" onClick={makeEditableReport}>X</button>
                            </>
                            :
                            ''
                            }
                            {!deliverable.editable && !deliverable.report_editable ?
                            <>
                            <button className="btn level-one" onClick={makeEditableReport}>Submit Report</button>
                            <button className="btn level-one" onClick={deleteDeliverable}>Delete</button>
                            </>
                            :
                            ''
                            }
                        </>
                        : deliverable.status === "approved" ?
                        <>
                            <button className="btn" onClick={claimFunds}>Claim Funds</button>
                        </>
                        :
                        <>
                        </>
                        }
                    </div>
                </div>
            );
        } else {
            
            return (
                <div className="single">{deliverable.deliverable_id}</div>
            );
        }
    }

    function RenderAdminMenu(){
        if (props.isAdmin === true ){
            return (
                <div className="admin-menu">
                    <h3>Admin Menu</h3>
                    <button className="btn" onClick={approveProposal} >Approve Proposal</button>
                    <button className="btn" onClick={rejectProposal} >Reject Proposal</button>
                    <button className="btn" onClick={newReviewer}>Set Reviewer</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else {
            return null;
        }
    }

    function RenderReviewerMenu(){
        if (activeUser && activeUser.accountName === proposal.reviewer && proposal.status === "submitted"){
            return (
                <div className="reviewer-menu">
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
                <div className="proposer-menu">
                    <h3>Proposer Menu</h3>
                    <Link to="edit">Edit Proposal</Link>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else if (activeUser && activeUser.accountName === proposal.proposer && proposal.status === "approved"){
            return (
                <div className="proposer-menu">
                    <h3>Proposer Menu</h3>
                    <button className="btn" onClick={beginVoting} >Begin Voting</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else if (activeUser && activeUser.accountName === proposal.proposer && proposal.status === "voting"){
            return (
                <div className="proposer-menu">
                    <h3>Proposer Menu</h3>
                    <button className="btn" onClick={endVoting}>End Voting</button>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else if (activeUser && activeUser.accountName === proposal.proposer && proposal.status !== "approved") {
            return (
                <div className="proposer-menu">
                    <h3>Proposer Menu</h3>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                </div>
            );
        } else  {
            return null;
        }

    }

    return (
        <div className="single-proposal">
            <div className="proposal-header">
                <h2>{proposal.title}</h2>
                <div><strong>Submitted by:</strong>{proposal.proposer}</div>
                <div><strong>Status:</strong>{proposal.status}</div>
                <div><strong>Reviewer:</strong>{proposal.reviewer}</div>
                <div><strong>Total Requested Funds:</strong>{proposal.total_requested_funds}</div>
            </div>
            <div className="backend-menus">
                <RenderAdminMenu />
                <RenderReviewerMenu />
                <RenderProposerMenu />
            </div>
            <div className="proposal-body">
                <p>{proposal.description}</p>
                <p>{proposal.content}</p>
            </div>
            <div className="voting">
                <RenderVoteTotals />
                <RenderVoteButtons />
            </div>
            <div className="deliverables">
                <div className="deliverables-header">
                    <strong>Deliverables:</strong> {proposal.deliverables_completed} / {proposal.deliverables} completed
                </div>
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