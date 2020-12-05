import React from 'react';
import {
Link
} from 'react-router-dom';

import categories from '../images/categories.svg';
import removeAccount from '../images/remove-user.svg';
import reviewProposals from '../images/review-proposal.svg';
import tokens from '../images/coins.svg';
import key from '../images/key.svg';
import stopwatch from '../images/stopwatch.svg';

export default function RenderAdminMenu() {


    return (
        <div className="admin-menu">
            <Link to="categories" className="admin-dashboard-item"><img src={categories} alt="categories" /><span className="label">Add/Remove Categories</span></Link>
            <Link to="/proposals/in-review/from_admin=true" className="admin-dashboard-item"><img src={reviewProposals} alt="Review Proposals"/><span className="label">Proposals to Review</span></Link>
            <Link to="/deliverables/assigned/from_admin=true" className="admin-dashboard-item"><img src={tokens} alt="Tokens" /><span className="label">Devliverables to Review</span></Link>
            <Link to="vote-duration" className="admin-dashboard-item"><img src={stopwatch} alt="Stop Watch"/><span className="label">Change Voting Period Duration</span></Link>
            <Link to="transfer-admin" className="admin-dashboard-item"><img src={key} alt="Key"/><span className="label">Transfer Administrative Role</span></Link>
            <Link to="remove-account" className="admin-dashboard-item"><img src={removeAccount} alt="Remove Account"/><span className="label">Remove Account or Profile</span></Link>
        </div>
    )
}