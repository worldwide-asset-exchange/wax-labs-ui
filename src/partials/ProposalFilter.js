import React from 'react';
import {
Link
} from 'react-router-dom';

export default function RenderProposalFilter(props) {
    console.log(props.activeUser);
    return (
    <div className="proposals-menu">
        <h2>Proposals</h2>
        {props.activeUser ?
        <Link to="/proposals/new">New Proposal</Link>
        :
        <></>
        }
        <ul>
        {props.activeUser ?
        <>    
            <li><Link to="/proposals/my-proposals">My Proposals</Link></li>
            <li><Link to="/proposals/my-drafts">My Draft Proposals</Link></li>
        </>
        :
        <></>
        }
        {props.activeUser && props.isAdmin ?
        <>
            <li><Link to="/proposals/in-review">In Review Proposals</Link></li>
        </>
        :
        <></>
        }
            <li><Link to="/proposals">Active Proposals</Link></li>
            <li><Link to="/proposals/archived">Archived Proposals</Link></li>
        </ul>
    </div>
    );
}