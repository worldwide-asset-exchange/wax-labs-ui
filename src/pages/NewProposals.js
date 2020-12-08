import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";
import * as globals from "../utils/vars";

import RenderGenericProposals from '../partials/GenericProposals';
import RenderProposalPage from './ProposalPage';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderProposals(props){
    const [categories, setCategories] = useState([]);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function getCategories() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: globals.LABS_CODE,
                      scope: globals.LABS_SCOPE,
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
                      code: globals.LABS_CODE,
                      scope: globals.LABS_SCOPE,
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
                            noProposalsMessage="Nope"
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
            </Routes>

         </div>
     )

}