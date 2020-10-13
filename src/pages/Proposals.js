import React from 'react';
import {
Routes,
Route,
Link
} from 'react-router-dom';

import RenderVotingProposals from '../partials/VotingProposals.js';
import RenderInReviewProposals from '../partials/InReviewProposals.js'
import RenderInProgressProposals from '../partials/InProgressProposals.js';
import RenderCompletedProposals from '../partials/CompletedProposals.js';
import RenderRejectedProposals from '../partials/RejectedProposals.js';
import RenderActiveProposals from '../partials/ActiveProposals.js';
import RenderArchivedProposals from '../partials/ArchivedProposals.js';
import RenderEditDraftProposal from '../partials/EditDraftProposal.js'
import RenderMyDraftProposals from '../partials/MyDraftProposals.js';
import RenderMyProposals from '../partials/MyProposals.js';
import RenderSingleProposal from './SingleProposal.js';

class RenderProposals extends React.Component {
    render(){
    return (
        <div className="proposals">
            <div className="proposals-menu">
                <Link to="new">New Proposal</Link>
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
                <ul>
                    <li><Link to="my-proposals">My Proposals</Link></li>
                    <li><Link to="my-drafts">My Draft Proposals</Link></li>
                </ul>
            </div>
            <div className="proposals-body">
                <Routes>
                    <Route path="/" element={<RenderActiveProposals />} />
                    <Route path="vote" element={<RenderVotingProposals />} />
                    <Route path="in-review" element={<RenderInReviewProposals />} />
                    <Route path="in-progress" element={<RenderInProgressProposals />} />
                    <Route path="archived" element={<RenderArchivedProposals />} />
                    <Route path="archived/rejected" element={<RenderRejectedProposals />} />
                    <Route path="archived/completed" element={<RenderCompletedProposals />} />
                    <Route path="my-drafts" element={<RenderMyDraftProposals accountName={this.props.accountName} />} />
                    <Route path="my-proposals" element={<RenderMyProposals accountName={this.props.accountName} />} />
                    <Route path="new" element={<RenderEditDraftProposal />} />
                    <Route path=":id" element={<RenderSingleProposal activeUser={this.props.activeUser} isAdmin={this.props.isAdmin} />} />
                </Routes>
            </div>
        </div>
    );
    }
}

export default RenderProposals;