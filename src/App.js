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
import RenderAdminPortal from './pages/AdminPortal.js';

import * as GLOBAL_VARS from './utils/vars';

import RenderFooter from './partials/Footer.js';
import RenderHeader from './partials/Header/Header';

export default function App(props)  {
  const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

  const [isAdmin, setIsAdmin ] = useState(false);
  const [queryingAdmin, setQueryingAdmin] = useState(true);
  const [categories, setCategories] = useState([]);
  const [queryingCategories, setQueryingCategories] = useState(true);

  useEffect(()=>{
    let cancelled = false;
    async function checkAdmin(){
      setQueryingAdmin(true);
      try {
        let resp = await wax.rpc.get_table_rows({
            code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            table: GLOBAL_VARS.CONFIG_TABLE,
            json: true,
            limit: 1
        });
        const adminAccount = resp.rows[0].admin_acct;
        // if dependency arrays changes cause useEffect to run again, we don't update state.
        if(!cancelled){
          if (props.ual.activeUser && props.ual.activeUser.accountName === adminAccount){
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
          setQueryingAdmin(false);
        }

      } catch(e) {
        console.log(e);
      }
    }
    async function getCategories() {
      setQueryingCategories(true);
      try {
          let resp = await wax.rpc.get_table_rows({
                code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                table: GLOBAL_VARS.CONFIG_TABLE,
                json: true,
                limit: 1
          });
          if(!cancelled){
            if (resp.rows.length){
                setCategories(resp.rows[0].categories);
            }
            else{
                setCategories([]);
            }
            setQueryingCategories(false);
          }
      } catch(e) {
          console.log(e);
      }
    }

    getCategories();
    checkAdmin();

    const cleanup = () => {cancelled = true;}

    return cleanup
    // eslint-disable-next-line
  },[props.ual.activeUser])


  return (
    <div className="App">
      <div className="wrapper">
        <RenderHeader
          activeUser={props.ual.activeUser}
          loginModal={props.ual.showModal}
          logout={props.ual.logout}
          isAdmin={isAdmin}
          queryingAdmin={queryingAdmin}
          queryingCategories={queryingCategories}
          categories={categories}
        />
        <main>
          <div className="content">
            <Routes>
            <Route path="/" element={<RenderHome/>} />
            <Route path="proposals/*" 
              element={
                <RenderProposals 
                  activeUser={props.ual.activeUser} 
                  isAdmin={isAdmin} 
                  categories={categories} 
                  loginModal={props.ual.showModal} 
                />
              } 
            />
            <Route path="account/*" 
              element={
                <RenderAccountPortal 
                  activeUser={props.ual.activeUser} 
                  categories={categories}

                /> 
              }
            />
            <Route path="admin/*" 
              element={
                <RenderAdminPortal 
                  activeUser={props.ual.activeUser} 
                  categories={categories}
                  isAdmin={isAdmin}
                  queryingAdmin={queryingAdmin}
                />
              } 
            />
            <Route path="*" element={<RenderErrorPage />} />
            </Routes>
          </div>
        </main>
      </div>
      <RenderFooter />
    </div>
  );

}