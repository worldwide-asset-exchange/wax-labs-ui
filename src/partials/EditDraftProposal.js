import React from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class RenderEditProposal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            proposal_id: '',
            proposer: '',
            title: '',
            category: '',
            description: '',
            content: '',
            total_requested_funds: '',
            deliverables_count: '',
            available_categories: []
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            [name]: value,
            }), () => { }
        );
    }

    getProposalDetails = (async) =>{
        // Retreives the details of the draft proposal based on the proposal_id. If no proposals are found, return state with blank values.
    }

    getCategories = (async) => {
        // Retreives the categories from the tab
    }

    // Remember to render in categories into the dropdown option tags

    render(){
        return (
            <div className="filtered-proposals edit-proposal">
                <h2>Edit Proposal</h2>
                <div className="edit-proposal-table">
                    <div className="row">
                        <div className="col label">
                            <strong>Proposal Title:</strong>
                            <input type="text" name="title" value={this.state.title} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Category:</strong>
                            <select name="category">
                                <option value="Value 1">Value 1</option>
                                <option value="Value 2">Value 2</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Description:</strong>
                            <textarea name="description" value={this.state.description}></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Content:</strong>
                            <textarea name="content" value={this.state.content}></textarea>
                        </div>     
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Total Requested Amount:</strong>
                            <input type="number" name="total_amount_requested" value={this.state.total_amount_request + ' WAX'} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Number of Deliverables:</strong>
                            <input type="number" name="deliverables_count" value={this.state.deliverables_count} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default RenderEditProposal;