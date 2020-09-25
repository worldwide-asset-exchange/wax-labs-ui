import * as React from 'react';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

function RenderHome() {
    
    async function getExpiringProposals(){

    }

    async function getNewProposals() {

    }

    return (
        <div><p>Home</p></div>
    );
}

export default RenderHome;