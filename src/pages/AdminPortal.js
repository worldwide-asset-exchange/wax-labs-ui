import React from 'react';
import {
Link
} from 'react-router-dom';

function RenderAdminPortal() {
    return (
            <div className="admin-portal">
                <div className="admin-body">
                    <Link>Proposals to Review</Link>
                    <Link>Devliverables to Review</Link>
                </div>
            </div>
        );
}

export default RenderAdminPortal;