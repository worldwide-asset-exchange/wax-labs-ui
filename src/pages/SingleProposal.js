import React, { useState, useEffect} from 'react';
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

    useEffect(() => {
        async function getProposal() {
            try {
                if (!proposal.proposer) {
                let resp = await wax.rpc.get_table_rows({             
                    code: 'labs.decide',
                    scope: 'labs.decide',
                    table: 'proposals',
                    json: true,
                    lower_bound: id,
                    upper_bound: id,
                });

                console.log(resp.rows[0]);
                setProposal(resp.rows[0]);

                const proposerAcct = resp.rows[0].proposer;
                const ballotName = resp.rows[0].ballot_name;
                
                return getVotes(proposerAcct, ballotName);

                }
                } catch(e) {
                    console.log(e);
            }
        }
        return getProposal();
     }, []);

     async function getVotes(proposerAcct, ballotName){
         try {
            let profile = await wax.rpc.get_table_rows({             
                code: 'labs.decide',
                scope: 'labs.decide',
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

            console.log(currentVote.rows[0].options);
            setVotes(currentVote.rows[0].options);
         } catch(e) {
            console.log(e);
         }
     }

     async function getDeliverables(){
        try {
                let delivs = await wax.rpc.get_table_rows({
                    code: 'labs.decide',
                    scope: 'labs.decide',
                    table: 'deliverables',
                    json: true,
                    lower_bound: id,
                    upper_bound: id,
                });
                console.log(delivs.rows);
                setDeliverables(delivs.rows);
        } catch(e) {
           console.log(e);
        }
    }

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
                        account: 'labs.decide',
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
                        account: 'labs.decide',
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
                        account: 'labs.decide',
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
                        account: 'labs.decide',
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
                        account: 'labs.decide',
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

     async function beginVoting() {
        try {        
            await props.activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs.decide',
                        name: 'beginvoting',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id,
                            ballot_name: proposal.ballot_name
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
        if (proposal.status === "in progress"){ 
            return (
                <div>
                {deliverables.map((deliverable) =>
                    <RenderSingleDeliverable deliverable={deliverable} key={deliverable.deliverable_id} />)}
                </div>
            );
        } else {
            return null;
        }
    } 

    function RenderSingleDeliverable(){
        if (activeUser === proposal.reviewer){
            return (
                <div className="single">Single deliverable with approval/denial.</div>
            );
        } else {
            return (
                <div className="single">Single deliverable.</div>
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
                    <Link to="/">Edit Proposal</Link>
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
        } else if (activeUser && activeUser.accountName === proposal.proposer && proposal.status !== "approved") {
            return (
                <div className="proposer-menu">
                    <h3>Proposer Menu</h3>
                    <button className="btn" onClick={cancelProposal}>Cancel Proposal</button>
                    <button className="btn" onClick={deleteProposal}>Delete Proposal</button>
                    <button className="btn" onClick={claimFunds}>Claim Funds</button>
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
                    <strong>Deliverables:</strong> {proposal.deliverables} {proposal.deliverables_completed}
                </div>
                <RenderDeliverables />
            </div>
        </div>
    );
}