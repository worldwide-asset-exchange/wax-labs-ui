import React, {useState, useEffect} from 'react';
import {
Routes,
Route,
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

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

export default function RenderProposals(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function getCategories() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs',
                      scope: 'labs',
                      table: 'config',
                      json: true,
                      lower_limit: props.accountName,
                      upper_limit: props.accountName,
                      limit: 1
                  });
                  if (resp.rows.length){
                  setCategories(resp.rows[0].categories);
                  }
                  else{
                      return null;
                  }
                } catch(e) {
                  console.log(e);
            }
        }
        getCategories();
     }, [props.accountName, wax.rpc]);
    
    return (
        <div className="proposals">
            <div className="proposals-menu">
                {props.activeUser ?
                <Link to="new">New Proposal</Link>
                :
                <></>
                }
                <ul>
                {props.activeUser ?
                <>    
                    <li><Link to="my-proposals">My Proposals</Link></li>
                    <li><Link to="my-drafts">My Draft Proposals</Link></li>
                </>
                :
                <></>
                }
                {props.activeUser && props.isAdmin ?
                <>
                    <li><Link to="in-review">In Review Proposals</Link></li>
                </>
                :
                <></>
                }
                </ul>
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
                    <Route path="in-review" element={<RenderInReviewProposals />} />
                    <Route path="in-progress" element={<RenderInProgressProposals />} />
                    <Route path="archived" element={<RenderArchivedProposals />} />
                    <Route path="archived/rejected" element={<RenderRejectedProposals />} />
                    <Route path="archived/completed" element={<RenderCompletedProposals />} />
                    <Route path="my-drafts" element={<RenderMyDraftProposals accountName={props.accountName} />} />
                    <Route path="my-proposals" element={<RenderMyProposals accountName={props.accountName} />} />
                    <Route path="new" element={<RenderEditDraftProposal activeUser={props.activeUser} categories={categories} />} />
                    <Route path=":id" element={<RenderSingleProposal activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path=":id/edit" element={<RenderEditDraftProposal activeUser={props.activeUser} categories={categories} />} />
                </Routes>
            </div>
        </div>
    );
}