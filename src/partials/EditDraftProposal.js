import React, { useState, useEffect } from 'react';
import {
/*Link,*/
useParams
} from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderEditProposal(props) {
    const { id } = useParams();
    const activeUser = props.activeUser;
    const [total_requested_funds, setTotalRequestedFunds] = useState([]);
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
    const validator = new SimpleReactValidator();

    useEffect(() => {
        let cleanAmount = 0;
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

                    cleanAmount = resp.rows[0].total_requested_funds.slice(0,-13);
                    setTotalRequestedFunds(cleanAmount);

                    setProposal(resp.rows[0]);
                } catch(e) {
                    console.log(e);
                }
            } else {
                return null;
            }
        }
        getProposalDetails();
        }, [id,]);

    function handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        if (name === "total_requested_funds") {
            setTotalRequestedFunds(prevState => 
                [value]
              , () => {} 
            );
            console.log(total_requested_funds)
        } else {
        setProposal(prevState => ({
            ...proposal, [name]: value 
          }), () => {} 
        );
        }
    }

    const transactionRequestedFunds = total_requested_funds + '.00000000 WAX';

    async function saveDraftProposal() {
        if (props.proposal_type === "New") {
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
                                total_requested_funds: transactionRequestedFunds,
                                deliverables_count: proposal.deliverables,
                            },
                        },
                    ]} , {
                    blocksBehind: 3,
                    expireSeconds: 30
            });
            } catch(e) {
                console.log(e);
            }
        } else if (props.proposal_type === "Edit") {
            try {
                await activeUser.signTransaction({
                    actions: [
                        {
                            account: 'labs',
                            name: 'editprop',
                            authorization: [{
                                actor: activeUser.accountName,
                                permission: 'active',
                            }],
                            data: {
                                proposal_id: id,
                                proposer: activeUser.accountName,
                                category: proposal.category,
                                title: proposal.title,
                                description: proposal.description,
                                content: proposal.content,
                                deliverables_count: proposal.deliverables,
                                total_requested_funds: transactionRequestedFunds,
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
    }

    async function submitProposal() {
        console.log(id);
        try {
            await activeUser.signTransaction({
                actions: [
                    /* {
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
                            total_requested_funds: transactionRequestedFunds,
                            deliverables_count: proposal.deliverables,
                        },
                    }, */
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
                <h2>{props.proposal_type} Proposal</h2>
                <div className="edit-proposal-table">
                    <div className="row">
                        <div className="col label">
                            <strong>Proposal Title:</strong>
                            <input type="text" name="title" value={proposal.title} onChange={handleInputChange} />
                            {validator.message('title', proposal.title, 'required|alpha')}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Category:</strong>
                            <select name="category"  onChange={handleInputChange}>
                                { props.proposal_type === "New" ?
                                <>
                                    <option value=""></option>
                                </>
                                : props.proposal_type === "Edit" ?
                                <>
                                    <option value={proposal.category}>{proposal.category}</option>
                                </>
                                :
                                ''
                                }
                                {props.categories.filter(x => proposal.category !== x).map((category) =>
                                    <option key={category}>{category}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Description:</strong>
                            <input name="description" value={proposal.description} onChange={handleInputChange} />
                            <span>A one sentence summary or tagline.</span>
                            {validator.message('description', proposal.description, 'required|alpha')}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Content:</strong>
                            <textarea name="content" value={proposal.content} onChange={handleInputChange} ></textarea>
                            {validator.message('content', proposal.content, 'required|alpha')}
                        </div>     
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Total Requested Amount (WAX):</strong>
                            <input type="number" name="total_requested_funds" value={total_requested_funds} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Number of Deliverables:</strong>
                            <input type="number" name="deliverables" value={proposal.deliverables} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="row submit-form">
                        <div className="col label">
                            <button className="btn draft" onClick={saveDraftProposal}>Save Draft</button>
                            <button className="btn" onClick={submitProposal}>Submit for Review</button>
                        </div>
                    </div>
                </div>
            </div>
        );
}