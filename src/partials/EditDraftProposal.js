import React, { useState, useEffect } from 'react';
import {
/*Link,*/
useParams
} from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import * as waxjs from "@waxio/waxjs/dist";

const WAX_ASSET_FORMAT = '.00000000 WAX';
const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
const validator = new SimpleReactValidator();
export default function RenderEditProposal(props) {
    const { id } = useParams();
    const activeUser = props.activeUser;
    const [tries, setTries] = useState(0);
    const [ proposal, setProposal ] = useState({
        proposer: '',
        category: '',
        status: '',
        title: '',
        description: '',
        content: '',
        image_url: '',
        total_requested_funds: '',
        remaining_funds: 0,
        estimated_time: '',
        deliverables: '',
        deliverables_count: 0,
        deliverables_completed: 0,
        reviewer: '',
        ballot_name: '',
        ballot_results: []
    });
 

    useEffect(() => {
        // let cleanAmount = 0;
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
                    /* Getting rid of the dot, decimals and WAX from the value*/
                    resp.rows[0].total_requested_funds = resp.rows[0].total_requested_funds.slice(0,-13);
                    
                    setProposal(resp.rows[0]);
                } catch(e) {
                    console.log(e);
                }
            } else {
                return null;
            }
        }
        getProposalDetails();
        }, [id]);

    function handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        setProposal(prevState => ({
            ...proposal, [name]: value 
          })
        );
        
    }

    const transactionRequestedFunds = proposal.total_requested_funds + WAX_ASSET_FORMAT;

    async function saveDraftProposal() {  
        console.log(validator.allValid());

        if(!validator.allValid()){
            
            validator.showMessages();
            setTries(tries + 1);
            return
        }
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
                                image_url: proposal.image_url,
                                estimated_time: proposal.estimated_time,
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
                                estimated_time: proposal.estimated_time,
                                image_url: proposal.image_url,
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
            if(validator.allValid()){
                await activeUser.signTransaction({
                    actions: [                       
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
            }
            else{
                validator.showMessages();
            }
        } catch(e) {
            console.log(e);
        }
    }
    
    const titleErrorMessage = validator.message('title', proposal.title, 'required|alpha_num_space');
    const categoryErrorMessage = validator.message('category', proposal.category, 'required');
    const descriptionErrorMessage = validator.message('description', proposal.description, 'required|max:255');
    const imageUrlErrorMessage = validator.message('image_url', proposal.image_url, 'required');
    const contentErrorMessage = validator.message('content', proposal.content, 'required');
    const estimatedTimeErrorMessage = validator.message('estimated_time', proposal.estimated_time, 'required|integer');
    const requestedFundsErrorMessage = validator.message('total_requested_funds', proposal.total_requested_funds, 'required|integer');
    const deliverablesErrorMessage = validator.message('deliverables', proposal.deliverables, 'required|integer');

    return (
            <div className="filtered-proposals edit-proposal">
                <h2>{props.proposal_type} Proposal</h2>
                <div className="edit-proposal-table">
                    <div className="row">
                        <div className="col label">
                            <strong>Proposal Title:</strong>
                            <input type="text" name="title" value={proposal.title} onChange={handleInputChange} />
                            {titleErrorMessage}
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
                                {props.categories/*.filter(x => proposal.category !== x)*/.map((category) =>
                                    <option key={category}>{category}</option>
                                )}
                            </select>
                            {categoryErrorMessage}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Description:</strong>
                            <input name="description" value={proposal.description} onChange={handleInputChange} />
                            <span>A one sentence summary or tagline.</span>
                            {descriptionErrorMessage}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Image Url:</strong>
                            <input name="image_url" value={proposal.image_url} onChange={handleInputChange} />
                            <span>Url to the cover image of your proposal.</span>
                            {imageUrlErrorMessage}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Content:</strong>
                            <textarea name="content" value={proposal.content} onChange={handleInputChange} ></textarea>
                            {contentErrorMessage}
                        </div>     
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Estimated time (days):</strong>
                            <input type="number" name="estimated_time" value={proposal.estimated_time} onChange={handleInputChange} />
                            <span>The estimated time it will take to complete all the deliverables.</span>
                            {estimatedTimeErrorMessage}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Total Requested Amount (WAX):</strong>
                            <input type="number" name="total_requested_funds" value={proposal.total_requested_funds} onChange={handleInputChange} />
                            {requestedFundsErrorMessage}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Number of Deliverables:</strong>
                            <input type="number" name="deliverables" value={proposal.deliverables} onChange={handleInputChange} />
                            {deliverablesErrorMessage}
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