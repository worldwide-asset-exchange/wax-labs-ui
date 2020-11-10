import React, {useState, useEffect} from 'react';
import {
  Link,
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import logo from "../assets/wax_labs_logo.svg";
import homeIcon from "../assets/bee-box-home.png";
import proposalsIcon from "../assets/certificate-proposals.png";
import deliverablesIcon from "../assets/honey-deliverables.png";
import adminIcon from "../assets/beekeeper-admin.png";


export default function RenderHeader(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [deliverables, setDeliverables] = useState(0);
    const [proposals, setProposals] = useState(0);
    const [end_voting_proposal, setEndVotingProposals] = useState(0);
    const [approved_proposals, setApprovedProposals] = useState(0);
    const [show_notifcations, setShowNotifications] = useState(false);
    const activeUser = props.activeUser;

    useEffect(() => {
        async function getNotifications(){
            console.log('run')
            try {
                let resp = await wax.rpc.get_table_rows({             
                    code: 'labs',
                    scope: 'labs',
                    table: 'proposals',
                    json: true,
                    index_position: 'fourth', //status
                    lower_bound: 'inprogress',
                    upper_bound: 'inprogress',
                    key_type: 'name'
                });

                let approvedResp = await wax.rpc.get_table_rows({             
                    code: 'labs',
                    scope: 'labs',
                    table: 'proposals',
                    json: true,
                    index_position: 'fourth', //status
                    lower_bound: 'approved',
                    upper_bound: 'approved',
                    key_type: 'name'
                });

                let endVoteCount = 0;
                let approvedCount = 0;

                if (activeUser) {
                    let myProposalsResp = await wax.rpc.get_table_rows({             
                        code: 'labs',
                        scope: 'labs',
                        table: 'proposals',
                        json: true,
                        index_position: 'secondary', //status
                        lower_bound: activeUser.accountName,
                        upper_bound: activeUser.accountName,
                        key_type: 'name'
                    });
                    myProposalsResp.rows.forEach(function (element) {
                        async function getBallots(){
                        let ballots = await wax.rpc.get_table_rows({             
                            code: 'decide',
                            scope: 'decide',
                            table: 'ballots',
                            json: true,
                            lower_bound: element.ballot_name,
                            upper_bound: element.ballot_name,
                        })

                        const now = new Date().toISOString();

                        element.end_time = ballots.rows[0].end_time
                        if (element.end_time < now && element.status === 'inprogress'){

                        endVoteCount = endVoteCount + 1;

                        setEndVotingProposals(endVoteCount);

                        }
                        if (element.status === "approved"){

                        approvedCount = approvedCount + 1;

                        setApprovedProposals(approvedCount);
                        }
                    }
                    getBallots()
                    
                    });
                }

                    let delivsCount = 0;
                    let proposalCount = 0;


                resp.rows.forEach(filteredProposal => {
                    proposalCount = proposalCount + 1;
                    async function getAssignedDelivs() {
                        try {
                                let delivsResp = await wax.rpc.get_table_rows({             
                                    code: 'labs',
                                    scope: filteredProposal.proposal_id,
                                    table: 'deliverables',
                                    json: true,
                                })                        


                                if (activeUser){
                                delivsResp.rows.forEach(function (element) {
                                    element.proposal_id = filteredProposal.proposal_id;
                                    element.deliverable_id_readable = element.deliverable_id;
                                    element.deliverable_id = filteredProposal.proposal_id+'.'+element.deliverable_id;
                                    element.proposal_title = filteredProposal.title;
                                    element.reviewer = filteredProposal.reviewer;
                                    console.log(activeUser)
                                    if (filteredProposal.reviewer === activeUser.accountName && element.status === "drafting"){
                                    delivsCount = delivsCount + 1;
                                    setDeliverables(delivsCount);
                                    }
                                    });
                                }

                        } catch(e) {
                            console.log(e);
                        }
                    }
                    getAssignedDelivs()
                });
                setProposals(proposalCount);
            } catch(e) {
                console.log(e);
            }
        }
    getNotifications();
    }, [activeUser]);
    
    function toggleNotificationsSubMenu() {
        setShowNotifications(!show_notifcations);
    }

    function RenderNotificationsSubMenu() {
        if (show_notifcations) {
            return (
                <ul className="notifications-submenu">
                    {proposals ?
                    <>
                        <li><span>{proposals} proposals to review</span></li>
                    </>
                    :
                    ''
                    }
                    {deliverables ?
                    <>
                        <li><span>{deliverables} deliverables to review</span></li>
                    </>
                    :
                    ''
                    }
                    {end_voting_proposal ?
                    <>
                        <li><span>{end_voting_proposal} proposals to end voting</span></li>
                    </>
                    :
                    ''
                    }
                    {approved_proposals ?
                    <>
                        <li><span>{proposals} proposals to begin</span></li>
                    </>
                    :
                    ''
                    }
                </ul>

            );
        } else {
            return null;
        }
    }

    if (props.activeUser && props.activeAuthenticator && props.isAdmin) {
        return (
            <header>
                <div className="nav-wrapper">
                    <div className="logo">
                        <Link className="header-link" to="/">
                            <img src={logo} alt="WAX Logo" width="201px" />
                        </Link>
                    </div>
                    <div className="menu-wrapper">
                        <nav>
                            <button id="menu-icon"></button>
                            <ul>
                                <li><Link to="/"><img src={homeIcon} /><span>Home</span></Link></li>
                                <li><Link to="/proposals"><img src={proposalsIcon} /><span>Proposals</span></Link></li>
                                <li><Link to="/deliverables"><img src={deliverablesIcon} /><span>Deliverables</span></Link></li>
                                <li><Link to="/admin"><img src={adminIcon} /><span>Admin</span></Link></li>
                                <li className="notifications"><button className={deliverables + proposals + end_voting_proposal + approved_proposals !== 0 ? "bell has-notifications" : "bell"} onClick={toggleNotificationsSubMenu}><span className="count">{deliverables + proposals + end_voting_proposal + approved_proposals}</span></button>
                                    <RenderNotificationsSubMenu />
                                </li>
                            </ul>
                        </nav>
                        <div className="login-wrapper">
                            <span className="accHeader">Account</span>
                            <span className="accName">{props.accountName}</span>
                            <Link className="accProfile" to="/account">Profile</Link>&nbsp;&bull;&nbsp;
                            <span className='logoutBtn' onClick={props.logout}>{'Logout'}</span>
                        </div>
                    </div>
                </div>
            </header>
        );
    } else if (props.activeUser && props.activeAuthenticator) {
        return (
            <header>
                <div className="nav-wrapper">
                    <div className="logo">
                        <Link className="header-link" to="/">
                            <img src={logo} alt="WAX Logo" width="235px" />
                        </Link>
                    </div>
                    <div className="menu-wrapper">
                        <div className="login-wrapper mobile">
                            <span className="accHeader">Account</span>
                            <span className="accName">{props.accountName}</span>&nbsp;&bull;&nbsp;
                            <span className='logoutBtn' onClick={props.logout}>{'Logout'}</span>
                        </div>
                        <nav>
                            <button id="menu-icon"></button>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/proposals">Proposals</Link></li>
                                <li><Link to="/proposals/my-proposals">My Proposals</Link></li>
                                <li className="notifications"><span className="count">{deliverables + end_voting_proposal + approved_proposals}</span></li>
                                <li className="login-li">
                                    <span className="accHeader">Account</span>
                                    <span className="accName">{props.accountName}</span>
                                    <span className='logoutBtn' onClick={props.logout}>{'Logout'}</span>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        );
    } else {
        return (
            <header>
                <div className="nav-wrapper">
                    <div className="logo">
                        <Link className="header-link" to="/">
                            <img src={logo} alt="WAX Logo" width="235px" />
                        </Link>
                    </div>
                    <div className="menu-wrapper">
                        <nav>
                            <button id="menu-icon"></button>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/proposals">Proposals</Link></li>
                                <li className="login-li"><button id="login" className="login-btn" onClick={props.showModal}>Login</button></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }

}