import React, {useState, useEffect} from 'react';
import {
Routes,
Route,
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

// import RenderInReviewProposals from '../partials/InReviewProposals.js'
// import RenderActiveProposals from '../partials/ActiveProposals.js';
// import RenderArchivedProposals from '../partials/ArchivedProposals.js';
import RenderEditDraftProposal from '../partials/EditDraftProposal.js'
// import RenderMyDraftProposals from '../partials/MyDraftProposals.js';
// import RenderMyProposals from '../partials/MyProposals.js';
import RenderSingleProposal from './SingleProposal.js';
import RenderGenericProposal from '../partials/GenericProposal';

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
                    {/* <Route path="/" element={<RenderActiveProposals activeUser={props.activeUser} isAdmin={props.isAdmin} />} /> */}
                    <Route
                        path="/"
                        element={
                            <RenderGenericProposal
                                activeUser={props.activeUser}
                                isAdmin={props.isAdmin}
                                queryArgs={[{bound: "inprogress", indexPosition: "fourth"}, {bound: "voting", indexPosition: "fourth"}]}
                                title="Active Proposals"
                                noProposalsMessage="There are currently no active proposals."
                            />
                        }
                    />

                    {/* <Route path="in-review" element={<RenderInReviewProposals from_admin="false" activeUser={props.activeUser} isAdmin={props.isAdmin} />} /> */}
                    <Route
                        path="in-review"
                        element={
                            <RenderGenericProposal
                                activeUser={props.activeUser}
                                isAdmin={props.isAdmin}
                                from_admin="false"
                                queryArgs={[{bound: "submitted", indexPosition: "fourth"}]}
                                // bound="submitted"
                                // indexPosition="fourth"
                                title="Proposals under review"
                                noProposalsMessage="There are currently no proposals under review."
                            />
                        }
                    />                       
                    {/* <Route path="in-review/from_admin=true" element={<RenderInReviewProposals from_admin="true" activeUser={props.activeUser} isAdmin={props.isAdmin} />} /> */}
                    <Route
                        path="in-review/from_admin=true"
                        element={
                            <RenderGenericProposal
                                activeUser={props.activeUser}
                                isAdmin={props.isAdmin}
                                from_admin="true"
                                queryArgs={[{bound: "submitted", indexPosition: "fourth"}]}
                                // bound="submitted"
                                // indexPosition="fourth"
                                title="Proposals under review"
                                noProposalsMessage="There are currently no proposals under review."
                            />
                        }
                    />

                    {/* <Route path="archived" element={<RenderArchivedProposals activeUser={props.activeUser} isAdmin={props.isAdmin} />} /> */}
                    <Route 
                        path="archived"
                        element={
                            <RenderGenericProposal
                                activeUser={props.activeUser}
                                isAdmin={props.isAdmin}
                                queryArgs={[{bound: "completed", indexPosition: "fourth"}]}
                                // bound="completed"
                                // indexPosition="fourth"
                                title="Archived proposals"
                                status="archived"
                                noProposalsMessage="There are currently no archived proposals."
                            />
                        }     
                    />                   
                    {/* <Route path="my-drafts" element={<RenderMyDraftProposals accountName={props.accountName} activeUser={props.activeUser} isAdmin={props.isAdmin} />} /> */}
                    <Route 
                        path="my-drafts"
                        element={
                            <RenderGenericProposal
                                activeUser={props.activeUser}
                                isAdmin={props.isAdmin}
                                queryArgs={[{bound: "drafting", indexPosition: "fourth"}]}
                                // bound="drafting"
                                // indexPosition="fourth"
                                noProposalsMessage="You do not have any saved draft proposals."
                                title="Draft proposals"
                            />
                        }
                    />
                    {/* <Route path="my-proposals" element={<RenderMyProposals accountName={props.accountName} activeUser={props.activeUser} isAdmin={props.isAdmin} />} /> */}
                    <Route 
                        path="my-proposals" 
                        element={
                            <RenderGenericProposal  
                                activeUser={props.activeUser} 
                                isAdmin={props.isAdmin} 
                                queryArgs={[{bound: props.accountName, indexPosition: "secondary"}]}
                                // bound={props.accountName}
                                // indexPosition="secondary"
                                noProposalsMessage="You currently have no proposals."
                                title="My proposals"
                            />
                        }
                    />
                    <Route path="new" element={<RenderEditDraftProposal activeUser={props.activeUser} categories={categories} proposal_type="New" />} />
                    <Route path=":id" element={<RenderSingleProposal activeUser={props.activeUser} isAdmin={props.isAdmin} />} />
                    <Route path=":id/edit" element={<RenderEditDraftProposal activeUser={props.activeUser} categories={categories} proposal_type="Edit" />} />
                </Routes>
        </div>
    );
}