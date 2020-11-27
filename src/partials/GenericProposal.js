import React, { useState, useEffect } from 'react';
import { Link/*, Routes, Route, useParams*/ } from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from "./ProposalGridSingle.js";
import RenderProposalFilter from "./ProposalFilter.js";


const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderGenericProposal(props) {
    const [proposals, setProposals ] = useState([]);
    const from_admin = props.from_admin;

    useEffect(() => {
        async function getProposals() {
            try {
                // console.log(props.queryArgs);
                let proposalsArray = []
                for(let i=0; i < props.queryArgs.length; i++){
                    let arg = props.queryArgs[i];
                    let resp = await wax.rpc.get_table_rows({             
                        code: 'labs',
                        scope: 'labs',
                        table: 'proposals',
                        json: true,
                        index_position: arg.indexPosition,
                        lower_bound: arg.bound,
                        upper_bound: arg.bound,
                        key_type: 'name'
                    });                  
                    // console.log(resp);                    
                    if (!resp.rows.length) {
                        return null
                    } else {                      
                        proposalsArray = [...proposalsArray, ...resp.rows]
                    }  
                }
                setProposals(proposalsArray);                            
            } catch(e) {
                console.log(e);
            }
        }
        if(props.queryArgs){
            getProposals();
        }
    }, [props.queryArgs]);

        function RenderBreadcrumbs(){
            if (from_admin === "true") {
                return <Link to="/admin">{'< Back to Admin'}</Link>;
            } else {
                return null;
            }
        }

        
       
        return (
            <div className="proposals-body">
                <RenderBreadcrumbs />
                <h2>Proposals</h2>
                <RenderProposalFilter activeUser={props.activeUser} status={props.status} isAdmin={props.isAdmin} />
                <div className="filtered-proposals review-proposals">
                    <h3>{props.title}</h3>
                    {   
                        proposals.length ?
                            proposals.map((proposal) =>
                                <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)
                        :
                        <p>{props.noProposalsMessage}</p>
                    }
                </div>
            </div>
        );
        
    }