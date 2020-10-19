import React, { useState, useEffect } from 'react';
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
import RenderAdminPortal from './pages/AdminPortal.js'; 

import RenderFooter from './partials/Footer.js';
import RenderHeader from './partials/Header.js';

export default function App(props)  {
  const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

  const [activeUser, setActiveUser ] = useState(null);
  const [accountName, setAccountName ] = useState('');
  const [isAdmin, setIsAdmin ] = useState(false);

  useEffect(() => {
    const { ual: { activeUser } } = props;
    if (activeUser && !props.ual.activeUser) {
      setActiveUser({ activeUser }, updateAccountName);
      checkAdmin();
    } else if (activeUser && props.ual.activeUser) {
      setActiveUser(null) && setAccountName('');
    }
  }, []);

  async function checkAdmin(){
    try {
      let resp = await wax.rpc.get_table_rows({             
          code: 'labs',
          scope: 'labs',
          table: 'config',
          json: true
      });

      if (resp.rows[0].admin_acct === activeUser.accountName){
        setIsAdmin(true);
      }

    } catch(e) {
      console.log(e);
    }
  }

  async function updateAccountName() {
    try {
      const userAccountName = await props.ual.activeUser.getAccountName();
      setAccountName(userAccountName);
    } catch (e) {
      console.warn(e);
    }
  }

  function renderLogoutBtn() {
    const { ual: { activeUser, activeAuthenticator, logout } } = props
    if (activeUser && activeAuthenticator) {
      return (
          <span className='logoutBtn' onClick={logout}>
            {'Logout'}
          </span>
      )
    }
  }
    return (
      <div className="App">
        {props.ual.activeUser ? 
        <>
        <RenderHeader showModal={props.ual.showModal} accountName={props.ual.activeUser.accountName} activeUser={props.ual.activeUser} activeAuthenticator={props.ual.activeAuthenticator} logout={props.ual.logout} isAdmin={isAdmin} />
        <main>
          <Routes>
          <Route path="/" element={<RenderHome/>} />
          <Route path="proposals/*" accountName={props.ual.activeUser.accountName} element={<RenderProposals accountName={props.ual.activeUser.accountName} activeUser={props.ual.activeUser} isAdmin={isAdmin} />} />
          <Route path="account/*" element={<RenderAccountPortal accountName={props.ual.activeUser.accountName} /> } />  
          <Route path="admin/*" element={<RenderAdminPortal accountName={accountName} activeUser={props.ual.activeUser} isAdmin={isAdmin} />} />
          <Route path="*" element={<RenderErrorPage />} />
          </Routes>
        </main>
        </>
        :
        <>
        <RenderHeader showModal={props.ual.showModal} isAdmin={isAdmin} />
        <main>
          <Route path="/" element={<RenderHome/>} />
          <Route path="proposals/*" element={<RenderProposals isAdmin={isAdmin} />} />
          <Route path="account/*" element={<RenderAccountPortal />} />
          <Route path="admin/*" element={<RenderAdminPortal isAdmin={isAdmin} />} />
          <Route path="*" element={<RenderErrorPage />} />
        </main>
        </>
        }
        <RenderFooter activeUser={props.ual.activeUser} activeAuthenticator={props.ual.activeAuthenticator} />
      </div>
    );
  }