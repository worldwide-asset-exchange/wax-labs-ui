import React from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class RenderActiveProposals extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            proposals: []
        };

        this.getActiveProposals = this.getActiveProposals.bind(this);
    }

    async getActiveProposals() {
        try {
            let resp = await wax.rpc.get_table_rows({             
                  code: 'labs.decide',
                  scope: 'labs.decide',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'drafting',
                  upper_bound: 'drafting',
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
        return this.getActiveProposals();
    }

    render(){
        return (
            <div className="filtered-proposals active">
                <h2>Active Proposals</h2>
                {this.state.proposals.map((proposal) =>
                <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
            </div>
        );
    }

}

export default RenderActiveProposals;