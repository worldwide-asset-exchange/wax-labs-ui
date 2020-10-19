import React, { useState, useEffect } from 'react';
import {
Routes,
Route,
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderAccountInfo from '../partials/AccountInfo.js';
import RenderEditAccountInfo from '../partials/EditAccountInfo.js';

export default function RenderAccountPortal(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [ userProfile, setProfile ] = useState({
        full_name: '',
        bio: '',
        image_url: '',
        country: '',
        website: '',
        contact: ''
    });

    const accountName = props.accountName;

    useEffect(() => {
        async function getAccountInfo() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs',
                      scope: 'labs',
                      table: 'profiles',
                      json: true,
                      lower_limit: accountName,
                      upper_limit: accountName,
                      limit: 1
                  });
                  if (resp.rows.length){
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
     }, []);
    if (props.accountName !== "") {
    return(
    <div className="account-portal">
        <div className="account-menu">
            <h3>Hello, {props.accountName}</h3>
            <ul>
                <li><Link to="/account">Account Info</Link></li>
                <li><Link to="/proposals/my-proposals">My Proposals</Link></li>
            </ul>
        </div>
        <div className="account-body">
            <Routes>
                <Route path="/" element={<RenderAccountInfo full_name={userProfile.full_name} bio={userProfile.bio} image_url={userProfile.image_url} country={userProfile.country} website={userProfile.website} contact={userProfile.contact} wax_account={userProfile.wax_account} />} />
                <Route path="edit" element={<RenderEditAccountInfo full_name={userProfile.full_name} bio={userProfile.bio} image_url={userProfile.image_url} country={userProfile.country} website={userProfile.website} contact={userProfile.contact} wax_account={userProfile.wax_account} />} />
            </Routes>
        </div>
    </div>
    );
    } else {
    return (
            <div className="account-portal">
                <div className="account-menu">
                    <h3>Hello, </h3>
                    <ul>
                        <li><Link to="/account">Account Info</Link></li>
                        <li><Link to="/my-proposals">My Proposals</Link></li>
                    </ul>
                </div>
                <div className="account-body">
                    <Routes>
                        <Route path="/" element={<RenderAccountInfo full_name="" bio="" image_url="" country="" website="" contact="" wax_account="" />} />
                        <Route path="edit" element={<RenderEditAccountInfo full_name="" bio="" image_url="" country="" website="" contact="" wax_account="" />} />
                    </Routes>
                </div>
            </div>
        );
    }
}