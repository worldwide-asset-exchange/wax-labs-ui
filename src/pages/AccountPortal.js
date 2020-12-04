import React, { useState, useEffect } from 'react';
import {
Routes,
Route,
// Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderAccountInfo from '../partials/AccountInfo.js';
import RenderEditAccountInfo from '../partials/EditAccountInfo.js';
import RenderPublicAccount from '../pages/PublicAccount.js';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderAccountPortal(props) {
    const [ userProfile, setProfile ] = useState();
    // const activeUser = props.activeUser;

    useEffect(() => {
        async function getAccountInfo() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs',
                      scope: 'labs',
                      table: 'profiles',
                      json: true,
                      lower_bound: props.accountName,
                      upper_bound: props.accountName,
                      limit: 1
                  });
                  console.log(resp.rows[0]);
                  if (resp.rows.length && resp.rows[0].wax_account === props.accountName){
                  setProfile(resp.rows[0]);
                  }
                  else{
                      return null;
                  }
                } catch(e) {
                  console.log(e);
            }
        }
        getAccountInfo(); 
     }, [props.accountName]);


    if (props.accountName && userProfile) {
        return(
        
        <div className="account-portal">
            <div className="account-body">
                    <div>
                        <Routes>
                            <Route path="/" element={<RenderAccountInfo full_name={userProfile.full_name} bio={userProfile.bio} image_url={userProfile.image_url} country={userProfile.country} website={userProfile.website} contact={userProfile.contact} wax_account={userProfile.wax_account} activeUser={props.activeUser} />} />
                            <Route path="edit" element={<RenderEditAccountInfo full_name={userProfile.full_name} bio={userProfile.bio} image_url={userProfile.image_url} country={userProfile.country} website={userProfile.website} contact={userProfile.contact} wax_account={userProfile.wax_account} activeUser={props.activeUser} />} />
                            <Route path=":accName" element={<RenderPublicAccount />} />
                        </Routes>
                    </div>
            </div>
        </div>
        );
    } else {
    return (
            <div className="account-portal">
                <div className="account-body">
                    <Routes>
                        <Route path="/" element={<RenderAccountInfo activeUser={props.activeUser} />} />
                        <Route path="edit" element={<RenderEditAccountInfo activeUser={props.activeUser} />} />
                        <Route path=":accName" element={<RenderPublicAccount activeUser={props.activeUser} />} />
                    </Routes>
                </div>
            </div>
        );
    }
}