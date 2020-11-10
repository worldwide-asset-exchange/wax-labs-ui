import React, { useState } from 'react';
import {
Routes,
Route,
} from 'react-router-dom'
import * as waxjs from "@waxio/waxjs/dist";

import './App.css';
import RenderHome from './pages/Home.js';
import RenderErrorPage from './pages/ErrorPage.js';
import RenderAccountPortal from './pages/AccountPortal.js';
import RenderProposals from './pages/Proposals.js';
import RenderDeliverables from './pages/Deliverables.js';
import RenderAdminPortal from './pages/AdminPortal.js'; 

import RenderFooter from './partials/Footer.js';
import RenderHeader from './partials/Header.js';

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
        
        if (props.ual.activeUser.accountName && props.ual.activeUser.accountName === adminAccount){
          setIsAdmin(true);
        } else {
          return null;
        }

      } catch(e) {
        console.log(e);
      }
    }

  if (props.ual.activeUser) {
    checkAdmin(); 
    return (
      <div className="App">
        <RenderHeader showModal={props.ual.showModal} accountName={props.ual.activeUser.accountName} activeUser={props.ual.activeUser} activeAuthenticator={props.ual.activeAuthenticator} logout={props.ual.logout} isAdmin={isAdmin} />
        <main>
          <div className="content">
            <Routes>
            <Route path="/" element={<RenderHome/>} />
            <Route path="proposals/*" accountName={props.ual.activeUser.accountName} element={<RenderProposals accountName={props.ual.activeUser.accountName} activeUser={props.ual.activeUser} isAdmin={isAdmin} />} />
            <Route path="deliverables/*" activeUser={props.ual.activeUser}  element={<RenderDeliverables activeUser={props.ual.activeUser} isAdmin={isAdmin} />} />
            <Route path="account/*" element={<RenderAccountPortal accountName={props.ual.activeUser.accountName} activeUser={props.ual.activeUser} /> } />  
            <Route path="admin/*" element={<RenderAdminPortal accountName={props.ual.activeUser.accountName} activeUser={props.ual.activeUser} isAdmin={isAdmin} />} />
            <Route path="*" element={<RenderErrorPage />} />
            </Routes>
          </div>
        </main>
        <RenderFooter />
        </div>
    );
  } else {
    return (
      <div className="App">
      <RenderHeader showModal={props.ual.showModal} isAdmin={isAdmin} />
      <main>
        <div className="content">
            <Routes>
            <Route path="/" element={<RenderHome/>} />
            <Route path="proposals/*" element={<RenderProposals isAdmin={isAdmin} />} />
            <Route path="deliverables/*" element={<RenderDeliverables isAdmin={isAdmin} />} />
            <Route path="account/*" element={<RenderAccountPortal />} />
            <Route path="admin/*" element={<RenderAdminPortal isAdmin={isAdmin} />} />
            <Route path="*" element={<RenderErrorPage />} />
            </Routes>
          </div>
      </main>
      <RenderFooter />
      </div>
    );
  }
}