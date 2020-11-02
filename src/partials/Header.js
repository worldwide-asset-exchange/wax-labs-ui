import React, {useState, useEffect} from 'react';
import {
  Link,
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

function RenderHeader(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [deliverables, setDeliverables] = useState();
    let total_proposals_check = 0;

    useEffect(() => {
        async function getNotifications(){
            try {
                let resp = await wax.rpc.get_table_rows({             
                    code: 'labs',
                    scope: 'labs',
                    table: 'proposals',
                    json: true,
                });
            
                if (!resp.rows.length) {
                    return null
                } else {
                    const total_proposals = resp.rows.length;
                    const stateArray = deliverables;
                        resp.rows.forEach(inProgProposal => {
                            async function getDelivs() {
                                try {
                                    if (total_proposals_check !== total_proposals){
                                        
                                        let delivsResp = await wax.rpc.get_table_rows({             
                                            code: 'labs',
                                            scope: inProgProposal.proposal_id,
                                            table: 'deliverables',
                                            json: true,
                                            primary_index: '',
                                            key_type: 'name',
                                            lower_bound: '',
                                            upper_bound: ''
                                        })

                                        delivsResp.rows.forEach(function (element) {
                                            element.proposal_id = inProgProposal.proposal_id;
                                            element.deliverable_id_readable = element.deliverable_id;
                                            element.deliverable_id = inProgProposal.proposal_id+'.'+element.deliverable_id;
                                            element.proposal_title = inProgProposal.title;
                                            element.reviewer = inProgProposal.reviewer;
                                          });
                                        

                                        let newArray = delivsResp.rows;

                                        Array.prototype.push.apply(stateArray, newArray); 

                                        total_proposals_check = total_proposals_check + 1;

                                    }  else if (total_proposals_check === total_proposals) {
                                        setDeliverables(stateArray);
                                    }
    
                                } catch(e) {
                                    console.log(e);
                                }
                                console.log(deliverables);
                        console.log(total_proposals_check);
                        }
                        getDelivs()
                    })
                }
            } catch(e) {
                console.log(e);
            }
        }
    getNotifications();
    }, []);     

    if (props.activeUser && props.activeAuthenticator && props.isAdmin) {
        return (
            <header>
                <nav>
                    <button id="menu-icon"></button>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/proposals">Proposals</Link></li>
                        <li><Link to="/deliverables">Deliverables</Link></li>
                        <li><Link to="/admin">Admin</Link></li>
                        <li><Link to="/account">Account Info</Link></li>
                        <li className="login-li">
                            <span className="accHeader">Account</span>
                            <span className="accName">{props.accountName}</span>
                            <span className='logoutBtn' onClick={props.logout}>{'Logout'}</span>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    } else if (props.activeUser && props.activeAuthenticator) {
        return (
            <header>
                <nav>
                    <button id="menu-icon"></button>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/proposals">Proposals</Link></li>
                        <li><Link to="/proposals/my-proposals">My Proposals</Link></li>
                        <li><Link to="/account">Account Info</Link></li>
                        <li className="login-li">
                            <span className="accHeader">Account</span>
                            <span className="accName">{props.accountName}</span>
                            <span className='logoutBtn' onClick={props.logout}>{'Logout'}</span>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    } else {
        return (
            <header>
                <nav>
                    <button id="menu-icon"></button>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/proposals">Proposals</Link></li>
                        <li className="login-li"><button id="login" className="login-btn" onClick={props.showModal}>Login</button></li>
                    </ul>
                </nav>
            </header>
        );
    }

}

export default RenderHeader;