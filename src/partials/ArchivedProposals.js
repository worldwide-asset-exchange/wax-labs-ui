import React from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class RenderArchivedProposals extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            proposals: []
        };

        this.getArchivedProposals = this.getArchivedProposals.bind(this);
    }

    async getArchivedProposals() {
        try {
            let resp = await wax.rpc.get_table_rows({             
                  code: 'labs.decide',
                  scope: 'labs.decide',
                  table: 'proposals',
                  json: true,
                  index_position: 'fourth', //status
                  lower_bound: 'completed',
                  upper_bound: 'rejected',
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
        const proposal_list = this.state.proposals;
        if (!proposal_list.length){
            return (
                <div className="filtered-proposals archived">
                    <h2>Archived Proposals</h2>
                    <p>There are currently no archived proposals.</p>
                </div>
            );
        } else {
            return (
                <div className="filtered-proposals archived">
                    <h2>Archived Proposals</h2>
                    {this.state.proposals.map((proposal) =>
                    <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                </div>
            );
        }
    }
}

export default RenderArchivedProposals;