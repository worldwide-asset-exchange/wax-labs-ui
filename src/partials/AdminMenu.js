import React from 'react';
import {
Link
} from 'react-router-dom';

export default function RenderAdminMenu() {
    return (
        <div className="admin-portal">
            <Link to="categories" className="admin-dashboard-item">Add/Remove Categories</Link>
            <Link to="/proposals/in-review" className="admin-dashboard-item">Proposals to Review</Link>
            <Link to="/deliverables" className="admin-dashboard-item">Devliverables to Review</Link>
            <Link to="vote-duration" className="admin-dashboard-item">Change Voting Period Duration</Link>
            <Link to="transfer-admin" className="admin-dashboard-item">Transfer Administrative Role</Link>
            <Link to="remove-account" className="admin-dashboard-item">Remove Account or Profile</Link>
        </div>
    )
}