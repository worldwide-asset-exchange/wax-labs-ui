import React from 'react';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderDeliverables(){
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    return (
        <div className="admin-content">
            
        </div>
    );
}