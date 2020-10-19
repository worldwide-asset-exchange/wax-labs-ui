import React, { useState, useEffect } from 'react';
import {
Link,
useParams
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderEditProposal(props) {
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
        deliverables_count: 0,
        deliverables_completed: 0,
        reviewer: '',
        ballot_name: '',
        ballot_results: []
    });

    useEffect(() => {
        async function getProposalDetails() {
            if (id) {
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
                } catch(e) {
                    console.log(e);
                }
            } else {
                return null;
            }
        }
        getProposalDetails();
        }, []);

    function handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        setProposal(prevState => ({
            ...proposal, [name]: value 
          }), () => {} 
        );
    }

    async function saveDraftProposal() {
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'draftprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposer: activeUser.accountName,
                            category: proposal.category,
                            title: proposal.title,
                            description: proposal.description,
                            content: proposal.content,
                            total_requested_funds: proposal.total_requested_funds,
                            deliverables_count: proposal.deliverables_count,
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

    async function submitProposal() {
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'draftprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposer: activeUser.accountName,
                            category: proposal.category,
                            title: proposal.title,
                            description: proposal.description,
                            content: proposal.content,
                            total_requested_funds: proposal.total_requested_funds,
                            deliverables_count: proposal.deliverables_count,
                        },
                    },
                    {
                        account: 'labs',
                        name: 'submitprop',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            proposal_id: id
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

    return (
            <div className="filtered-proposals edit-proposal">
                <h2>Edit Proposal</h2>
                <div className="edit-proposal-table">
                    <div className="row">
                        <div className="col label">
                            <strong>Proposal Title:</strong>
                            <input type="text" name="title" value={proposal.title} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Category:</strong>
                            <select name="category" onChange={handleInputChange} >
                                <option value=""></option>
                                {props.categories.map((category) =>
                                    <option key={category}>{category}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Description:</strong>
                            <textarea name="description" value={proposal.description} onChange={handleInputChange} ></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Content:</strong>
                            <textarea name="content" value={proposal.content} onChange={handleInputChange} ></textarea>
                        </div>     
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Total Requested Amount:</strong>
                            <input type="text" name="total_requested_funds" value={proposal.total_requested_funds} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Number of Deliverables:</strong>
                            <input type="number" name="deliverables_count" value={proposal.deliverables_count} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <button className="btn draft" onClick={saveDraftProposal}>Save Draft</button>
                            <button className="btn" onClick={submitProposal}>Submit for Review</button>
                        </div>
                    </div>
                </div>
            </div>
        );
}