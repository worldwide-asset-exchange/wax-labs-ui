import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";
import * as globals from "../utils/vars";

import RenderGenericProposals from '../partials/GenericProposals';
import RenderProposalPage from './ProposalPage';
import RenderEditProposal from '../partials/EditPage/EditProposal';
import RenderEditDraftProposal from '../partials/EditDraftProposal';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderProposals(props){
    const [categories, setCategories] = useState([]);
    const [profile, setProfile] = useState(null);

    console.log(props.activeUser);
    useEffect(() => {
        async function getCategories() {
            try {
                let resp = await wax.rpc.get_table_rows({
                      code: globals.LABS_CONTRACT_ACCOUNT,
                      scope: globals.LABS_CONTRACT_ACCOUNT,
                      table: globals.CONFIG_TABLE,
                      json: true,
                      limit: 1
                });
                if (resp.rows.length){
                    setCategories(resp.rows[0].categories);
                }
                else{
                    setCategories([]);
                }
            } catch(e) {
                console.log(e);
            }
        }
        getCategories();
     }, []);
     useEffect(()=>{
        async function getProfile(){
            // console.log(props.activeUser);
            try {
                let resp = await wax.rpc.get_table_rows({
                      code: globals.LABS_CONTRACT_ACCOUNT,
                      scope: globals.LABS_CONTRACT_ACCOUNT,
                      table: globals.PROFILES_TABLE,
                      lower_bound: props.activeUser.accountName,
                      upper_bound: props.activeUser.accountName,
                      json: true,
                      limit: 1
                });
                if (resp.rows.length){
                    setProfile(resp.rows[0]);
                }
                else{
                    setProfile(null);
                }
            } catch(e) {
                console.log(e);
            }
        }
        if(props.activeUser){
            getProfile();
        }
     }, [props.activeUser])

     return (
         <div className="proposals">
            <Routes>
                <Route
                    path="/"
                    element={
                        <RenderGenericProposals
                            noProposalsMessage="The list for this filters is empty. Try changing the filters."
                            categories={categories}
                            profile={profile}
                            activeUser={props.activeUser}
                        />
                    }
                />
                <Route
                    path="/:id"
                    element={
                        <RenderProposalPage
                            activeUser={props.activeUser}
                            isAdmin={props.isAdmin}
                        />
                    }
                />
                <Route path="new" element={<RenderEditDraftProposal activeUser={props.activeUser} categories={categories} proposal_type="New" />} />
                <Route path=":id/edit" element={<RenderEditProposal activeUser={props.activeUser} categories={categories}/>} />

            </Routes>

         </div>
     )

}