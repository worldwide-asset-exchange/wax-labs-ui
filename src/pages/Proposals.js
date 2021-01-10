import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";
import * as GLOBAL_VARS from "../utils/vars";

import RenderGenericProposals from '../partials/GenericProposals';
import RenderProposalPage from './ProposalPage';
import RenderEditProposal from '../partials/EditPage/EditProposal';
import RenderCreateProposalPage from '../partials/CreateProposalPage/CreateProposalPage';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderProposals(props){
    const [profile, setProfile] = useState(null);

    let categories = props.categories;
    useEffect(()=>{
        let cancelled = false;
        async function getProfile(){
            // console.log(props.activeUser);
            try {
                let resp = await wax.rpc.get_table_rows({
                        code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        table: GLOBAL_VARS.PROFILES_TABLE,
                        lower_bound: props.activeUser.accountName,
                        upper_bound: props.activeUser.accountName,
                        json: true,
                        limit: 1
                });
                if(!cancelled){
                    if (resp.rows.length){
                        setProfile(resp.rows[0]);
                    }
                    else{
                        setProfile(null);
                    }
                }    
            } catch(e) {
                console.log(e);
            }
        }
        if(props.activeUser){
            getProfile();
        }

        const cleanup = () => { cancelled = true }
        return cleanup
    }, [props.activeUser])

     return (
         <div className="proposals">
            <Routes>
                <Route
                    path="/"
                    element={
                        <RenderGenericProposals
                            noProposalsMessage="The list for these filters is empty. Try changing the filters."
                            categories={categories}
                            profile={profile}
                            showCreateButton={true}
                            activeUser={props.activeUser}
                            defaultStatus={[GLOBAL_VARS.VOTING_KEY, GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY]}
                        />
                    }
                />
                <Route
                    path="/:id"
                    element={
                        <RenderProposalPage
                            activeUser={props.activeUser}
                            isAdmin={props.isAdmin}
                            categories={categories}
                            loginModal={props.loginModal}
                        />
                    }
                />
                <Route
                    path="create"
                    element={
                        <RenderCreateProposalPage
                            activeUser={props.activeUser}
                            categories={categories}
                        />}
                    />
                <Route
                    path=":id/edit"
                    element={
                        <RenderEditProposal
                            activeUser={props.activeUser}
                            categories={categories}
                        />
                    }
                />

            </Routes>

         </div>
     )

}