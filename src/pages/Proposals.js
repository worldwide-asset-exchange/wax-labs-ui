import React from 'react';
import {
Routes,
Route,
Link
} from 'react-router-dom';

import RenderVotingProposals from '../partials/VotingProposals.js';
import RenderInProgressProposals from '../partials/InProgressProposals.js';
import RenderCompletedProposals from '../partials/CompletedProposals.js';
import RenderRejectedProposals from '../partials/RejectedProposals.js';
import RenderActiveProposals from '../partials/ActiveProposals.js';
import RenderArchivedProposals from '../partials/ArchivedProposals.js';

function RenderProposals() {
    return (
        <div className="proposals">
            <div className="proposals-filter">
                <h3>Active Proposals</h3>
                <ul>
                    <li><Link to="/proposals">All Active Proposals</Link></li>
                    <li><Link to="vote">In Vote Proposals</Link></li>
                    <li><Link to="in-progress">In Progress Proposals</Link></li>
                </ul>
                <h3>Archived Proposals</h3>
                <ul>
                    <li><Link to="archived">All Archived Proposals</Link></li>
                    <li><Link to="archived/completed">Completed Proposals</Link></li>
                    <li><Link to="archived/rejected">Rejected Proposals</Link></li>
                </ul>
            </div>
            <div className="proposals-body">
                <Routes>
                    <Route path="/" element={<RenderActiveProposals />} />
                    <Route path="vote" element={<RenderVotingProposals />} />
                    <Route path="in-progress" element={<RenderInProgressProposals />} />
                    <Route path="archived" element={<RenderArchivedProposals />} />
                    <Route path="archived/rejected" element={<RenderRejectedProposals />} />
                    <Route path="archived/completed" element={<RenderCompletedProposals />} />
                </Routes>
            </div>
        </div>
    );
}

export default RenderProposals;