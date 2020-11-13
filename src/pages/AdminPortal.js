import React from 'react';
import {
Routes,
Route
} from 'react-router-dom';

import RenderAdminMenu from '../partials/AdminMenu.js';
import RenderAdminCategories from '../partials/AdminCategories.js';
import RenderVoteDuration from '../partials/AdminVoteDuration.js';
import RenderAdminRole from '../partials/AdminRole.js';
import RenderRemoveAccount from '../partials/AdminRemoveAccount.js';

export default function RenderAdminPortal(props) {
    return (
            <div className="admin-portal">
                <h2>Admin Portal</h2>
                <div className="admin-body">
                <Routes>
                    <Route path="/" element={<RenderAdminMenu />} />
                    <Route path="categories" element={<RenderAdminCategories accountName={props.accountName} activeUser={props.activeUser} />} />
                    <Route path="vote-duration" element={<RenderVoteDuration accountName={props.accountName} activeUser={props.activeUser} />} />
                    <Route path="transfer-admin" element={<RenderAdminRole accountName={props.accountName} activeUser={props.activeUser} />} />
                    <Route path="remove-account" element={<RenderRemoveAccount accountName={props.accountName} activeUser={props.activeUser} />} />
                </Routes>
                </div>
            </div>
        );
}