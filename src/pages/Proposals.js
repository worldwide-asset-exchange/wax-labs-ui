import React, {useState, useEffect} from 'react';
import {
Routes,
Route,
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderInReviewProposals from '../partials/InReviewProposals.js'
import RenderActiveProposals from '../partials/ActiveProposals.js';
import RenderArchivedProposals from '../partials/ArchivedProposals.js';
import RenderEditDraftProposal from '../partials/EditDraftProposal.js'
import RenderMyDraftProposals from '../partials/MyDraftProposals.js';
import RenderMyProposals from '../partials/MyProposals.js';
import RenderSingleProposal from './SingleProposal.js';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderProposals(props) {
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
                      limit: 100
                });
                if (resp.rows.length){
                    console.log(resp.rows)
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
     }, [props.accountName]);
    
    return (
        <div className="proposals">
                <Routes>
                    <Route path="/" element={<RenderActiveProposals activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path="in-review" element={<RenderInReviewProposals from_admin="false" activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path="in-review/from_admin=true" element={<RenderInReviewProposals from_admin="true" activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path="archived" element={<RenderArchivedProposals activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path="my-drafts" element={<RenderMyDraftProposals accountName={props.accountName} activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path="my-proposals" element={<RenderMyProposals accountName={props.accountName} activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path="new" element={<RenderEditDraftProposal activeUser={props.activeUser} categories={categories} proposal_type="New" />} />
                    <Route path=":id" element={<RenderSingleProposal activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path=":id/edit" element={<RenderEditDraftProposal activeUser={props.activeUser} categories={categories} proposal_type="Edit" />} />
                </Routes>
        </div>
    );
}