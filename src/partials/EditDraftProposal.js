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

                    console.log(resp.rows[0]);
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

        setProposal(prevState => {
            return { ...prevState, [name]: value }
          } 
        );
    }

    async function getCategories() {
        // Remember to render in categories into the dropdown option tags
    }

    async function saveDraftProposal() {
        // Creates a proposal in draft status
    }

    async function submitProposal() {
        // Changes the status of the draft to in-review
    }

    console.log(proposal);

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
                                <option value="Value 1">Value 1</option>
                                <option value="Value 2">Value 2</option>
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
                            <input type="text" name="total_amount_requested" value={proposal.total_requested_funds} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Number of Deliverables:</strong>
                            <input type="number" name="deliverables_count" value={proposal.deliverables} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
            </div>
        );
}