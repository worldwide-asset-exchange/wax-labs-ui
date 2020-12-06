import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderGenericProposals from '../partials/GenericProposals';
import RenderProposalPage from './ProposalPage';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderProposals(props){
    const [categories, setCategories] = useState({});

    useEffect(() => {
        async function getCategories() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs',
                      scope: 'labs',
                      table: 'config',
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

     return (
         <div className="proposals">
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <RenderGenericProposals 
                            noProposalsMessage="Nope"
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