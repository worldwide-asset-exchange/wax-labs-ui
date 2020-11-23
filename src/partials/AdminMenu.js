import React from 'react';
import {
Link
} from 'react-router-dom';

import categories from '../assets/categories.svg';
import removeAccount from '../assets/remove-user.svg';
import reviewProposals from '../assets/review-proposal.svg';
import tokens from '../assets/coins.svg';
import key from '../assets/key.svg';
import stopwatch from '../assets/stopwatch.svg';

export default function RenderAdminMenu() {


    return (
        <div className="admin-menu">
            <Link to="categories" className="admin-dashboard-item"><img src={categories} /><span className="label">Add/Remove Categories</span></Link>
            <Link to="/proposals/in-review/from_admin=true" className="admin-dashboard-item"><img src={reviewProposals} /><span className="label">Proposals to Review</span></Link>
            <Link to="/deliverables/assigned/from_admin=true" className="admin-dashboard-item"><img src={tokens} /><span className="label">Devliverables to Review</span></Link>
            <Link to="vote-duration" className="admin-dashboard-item"><img src={stopwatch} /><span className="label">Change Voting Period Duration</span></Link>
            <Link to="transfer-admin" className="admin-dashboard-item"><img src={key} /><span className="label">Transfer Administrative Role</span></Link>
            <Link to="remove-account" className="admin-dashboard-item"><img src={removeAccount} /><span className="label">Remove Account or Profile</span></Link>
        </div>
    )
}