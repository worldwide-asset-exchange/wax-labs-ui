import React, {useState, useEffect} from 'react';
import {
/*Link,*/
useParams
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderProposalGrid from '../partials/ProposalGridSingle.js';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderProposals(props) {
    const [account, setAccount] = useState();
    const [proposals, setProposals] = useState([]);
    const { accName } = useParams();
    useEffect(() => {
        async function getAccount() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs',
                      scope: 'labs',
                      table: 'profiles',
                      json: true,
                      lower_bound: accName,
                      upper_bound: accName,
                      limit: 1
                  });
                  if (resp.rows.length){
                    setAccount(resp.rows[0]);
                    let proposalResp = await wax.rpc.get_table_rows({             
                        code: 'labs',
                        scope: 'labs',
                        table: 'proposals',
                        json: true,
                        index_position: 'secondary',
                        lower_bound: accName,
                        upper_bound: accName,
                        key_type: 'name'
                    });
                    if (proposalResp.rows.length){
                        setProposals(proposalResp.rows);
                    }
                  }
                } catch(e) {
                  console.log(e);
            }
        }
        getAccount();
     }, [accName]);

    if (account){
        console.log(account);
        return (
            <div className="public-account">
                <div className="account-info-wrapper">
                    <div className="account-image">
                        <img src={account.image_url} alt="" />
                    </div>
                    <div className="account-info-table">
                        <div className="row">
                            <h2>{account.wax_account} - WAX Labs Profile</h2>
                        </div>
                        <div className="row">
                            <div className="col label">
                                <strong>Name:</strong>
                                <p>{account.full_name}</p>
                            </div>
                        </div>
                        <div className="row">
                                <strong>Biography:</strong>
                                <p>{account.bio}</p>
                        </div>
                        <div className="row">
                                <strong>Country:</strong>    
                                <p>{account.country}</p>                           
                        </div>
                        <div className="row">
                            <div className="col label">
                                <strong>Website:</strong>   
                                <p>{account.website}</p>           
                            </div>                         
                        </div>
                        <div className="row">
                            <div className="col label">
                                <strong>Telegram Handle:</strong>   
                                <p>{account.contact}</p>              
                            </div>                         
                        </div>
                    </div>
                </div>
                <div className="account-proposals">
                        <h2>Proposals</h2>
                        { proposals ?
                        <>
                        {proposals.map((proposal) =>
                        <RenderProposalGrid proposal={proposal} key={proposal.proposal_id} />)}
                        </>
                        :
                        <p>{account.full_name} has not submitted any proposals.</p>
                        }
                    </div>
            </div>
        );
    } else {
        return null;
    }
}