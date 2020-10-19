import React from 'react';
import {
Link,
Routes,
Route
} from 'react-router-dom';

import RenderAdminMenu from '../partials/AdminMenu.js';
import RenderAdminCategories from '../partials/AdminCategories.js';
import RenderDeliverablesReview from '../partials/AdminDeliverables.js';
import RenderVoteDuration from '../partials/AdminVoteDuration.js';
import RenderAdminRole from '../partials/AdminRole.js';
import RenderRemoveAccount from '../partials/AdminRemoveAccount.js';

export default function RenderAdminPortal(props) {
    return (
            <div className="admin-portal">
                <div className="admin-body">
                <Routes>
                    <Route path="/" element={<RenderAdminMenu />} />
                    <Route path="categories" element={<RenderAdminCategories accountName={props.accountName} activeUser={props.activeUser} />} />
                    <Route path="deliverables-review" element={<RenderDeliverablesReview accountName={props.accountName} />} />
                    <Route path="vote-duration" element={<RenderVoteDuration accountName={props.accountName} activeUser={props.activeUser} />} />
                    <Route path="transfer-admin" element={<RenderAdminRole accountName={props.accountName} activeUser={props.activeUser} />} />
                    <Route path="remove-account" element={<RenderRemoveAccount accountName={props.accountName} activeUser={props.activeUser} />} />
                </Routes>
                </div>
            </div>
        );
}