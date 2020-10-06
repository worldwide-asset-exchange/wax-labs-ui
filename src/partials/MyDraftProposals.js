import React from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class RenderMyDraftProposals extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            proposals: []
        }

        this.getDraftProposals = this.getDraftProposals.bind(this);
    }

    async getDraftProposals() {
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
                return null;
                } else {
                    this.setState({
                        proposals: resp.rows
                    });
                }
            } catch(e) {
              console.log(e);
        }
        console.log(this.props.accountName);   
    }

    componentDidMount(){
        return this.getDraftProposals();
    }
    

    render(){
        const proposal_list = this.state.proposals;
        if (!proposal_list.length){
            return (
                <div className="filtered-proposals my-drafts">
                    <h2>Draft Proposals</h2>
                    <p>You do not have any saved draft proposals.</p>
                </div>
            )
        } else {
            return (
                <div className="filtered-proposals my-drafts">
                    <h2>Draft Proposals</h2>
                    {this.state.proposals.filter(proposal => proposal.proposer === this.props.accountName).map((filteredProposal) =>
                    <RenderProposalGrid proposal={filteredProposal} key={filteredProposal.proposal_id} />)}
                </div>
            );
        }
    }
}

export default RenderMyDraftProposals;