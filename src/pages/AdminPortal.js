import React from 'react';
import {
Link
} from 'react-router-dom';

function RenderAdminPortal() {
    return (
            <div className="admin-portal">
                <div className="admin-body">
                    <Link to="/proposals/in-review">Proposals to Review</Link>
                    <Link to="/deliverables-in-review">Devliverables to Review</Link>
                </div>
            </div>
        );
}

export default RenderAdminPortal;