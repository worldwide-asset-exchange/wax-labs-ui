import React from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGridSingle from "./ProposalGridSingle.js";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class RenderCompletedProposals extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="filtered-proposals completed">
                <h2>Archived Proposals: Completed</h2>
            </div>
        );
    }

}

export default RenderCompletedProposals;