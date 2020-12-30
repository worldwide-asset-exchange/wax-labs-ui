import React, { useEffect, useState } from 'react';
import {
Routes,
Route,
} from 'react-router-dom'
import * as waxjs from "@waxio/waxjs/dist";

import './App.scss';

import RenderHome from './pages/Home.js';
import RenderErrorPage from './pages/ErrorPage.js';
import RenderAccountPortal from './pages/AccountPortal.js';
import RenderProposals from './pages/Proposals.js';
import RenderDeliverables from './pages/Deliverables.js';
import RenderAdminPortal from './pages/AdminPortal.js';

import RenderFooter from './partials/Footer.js';
import RenderHeader from './partials/Header/Header';

export default function App(props)  {
  const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

  const [isAdmin, setIsAdmin ] = useState(false);

  async function checkAdmin(){
    try {
      let resp = await wax.rpc.get_table_rows({
          code: 'labs',
          scope: 'labs',
          table: 'config',
          json: true,
          limit: 1
      });

      const adminAccount = resp.rows[0].admin_acct;

      if (props.ual.activeUser && props.ual.activeUser.accountName === adminAccount){
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

    } catch(e) {
      console.log(e);
    }
  }
  useEffect(()=>{
    checkAdmin();
    // eslint-disable-next-line
  },[props.ual.activeUser])

 
  return (
    <div className="App">
      <div className="wrapper">
        {/* <RenderHeader showModal={props.ual.showModal} accountName={props.ual.activeUser.accountName} activeUser={props.ual.activeUser} activeAuthenticator={props.ual.activeAuthenticator} logout={props.ual.logout} isAdmin={isAdmin} /> */}
        <RenderHeader 
          activeUser={props.ual.activeUser} 
          loginModal={props.ual.showModal} 
          logout={props.ual.logout}
          isAdmin={isAdmin}
        />
        <main>
          <div className="content">
            <Routes>
            <Route path="/" element={<RenderHome/>} />
            <Route path="proposals/*" element={<RenderProposals activeUser={props.ual.activeUser} isAdmin={isAdmin} />} />
            <Route path="deliverables/*" activeUser={props.ual.activeUser}  element={<RenderDeliverables activeUser={props.ual.activeUser} isAdmin={isAdmin} />} />
            <Route path="account/*" element={<RenderAccountPortal activeUser={props.ual.activeUser} /> } />
            <Route path="admin/*" element={<RenderAdminPortal activeUser={props.ual.activeUser} isAdmin={isAdmin} />} />
            <Route path="*" element={<RenderErrorPage />} />
            </Routes>
          </div>
        </main>
      </div>
      <RenderFooter />
    </div>
  );
  
}