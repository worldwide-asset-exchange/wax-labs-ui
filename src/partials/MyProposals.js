import React from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class RenderMyProposals extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            proposals: [],
        };

        this.getMyProposals = this.getMyProposals.bind(this);
    }

    async getMyProposals() {
        try {
            let resp = await wax.rpc.get_table_rows({             
                  code: 'labs.decide',
                  scope: 'labs.decide',
                  table: 'proposals',
                  json: true,
                  index_position: 'secondary',
                  lower_bound: this.props.accountName,
                  upper_bound: this.props.accountName,
                  key_type: 'name'
              });
            
            if (!resp.rows.length) {
                return null
                } else {
                    this.setState({
                        proposals: resp.rows
                    });
                }
            } catch(e) {
              console.log(e);
        }
        console.log(this.state); 
    }

    componentDidMount(){
        return this.getMyProposals();
    }

    render(){
        console.log(this.props.accountName);
        return (
            <div className="filtered-proposals my-proposals">
                <h2>My Proposals</h2>
                {this.state.proposals.map((proposal) =>
                <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
            </div>
        );
    }

}

export default RenderMyProposals;