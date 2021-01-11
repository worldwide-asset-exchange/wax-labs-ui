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
import RenderProfilePage from './pages/ProfilePage';

import * as GLOBAL_VARS from './utils/vars';

import RenderFooter from './partials/Footer.js';
import RenderHeader from './partials/Header/Header';
import { sleep } from './utils/util';

export default function App(props)  {
  const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

  const [isAdmin, setIsAdmin ] = useState(false);
  const [queryingAdmin, setQueryingAdmin] = useState(true);

  const [categories, setCategories] = useState([]);
  const [deprecatedCategories, setDeprecatedCategories] = useState([]);
  const [votingDuration, setVotingDuration] = useState(60);
  const [queryingConfigs, setQueryingConfigs] = useState(true);

  const [configQueryCount, setConfigQueryCount] = useState(0);
  const [adminQueryCount, setAdminQueryCount] = useState(0);


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
    

    checkAdmin();

    const cleanup = () => {cancelled = true;}

    return cleanup
    // eslint-disable-next-line
  },[props.ual.activeUser, adminQueryCount]);


  //Callback that reruns the query after a small delay
  //it is called in case certain actions that are expected to change
  //configs are called
  async function rerunConfigQuery(){
    setQueryingConfigs(true);
    await sleep(3500);
    setConfigQueryCount(configQueryCount + 1);
  }
  
  // called when SetAdmin action is called
  async function rerunCheckAdmin(){
    setQueryingAdmin(true);
    await sleep(3500);
    setAdminQueryCount(adminQueryCount + 1);
  }

  useEffect(()=>{
    let cancelled = false;
    async function getCategories() {
      setQueryingConfigs(true);
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
              setDeprecatedCategories(resp.rows[0].cat_deprecated);
              setVotingDuration(resp.rows[0].vote_duration);
            }
            else{
              setCategories([]);
              setDeprecatedCategories([]);
              setVotingDuration(60);
            }
            setQueryingConfigs(false);
          }
      } catch(e) {
          console.log(e);
      }
    }

    getCategories();

    const cleanup = () => {cancelled = true;}

    return cleanup
    // eslint-disable-next-line
  }, [configQueryCount])


  return (
    <div className="App">
      <div className="wrapper">
        <RenderHeader
          activeUser={props.ual.activeUser}
          loginModal={props.ual.showModal}
          logout={props.ual.logout}
          isAdmin={isAdmin}
          queryingAdmin={queryingAdmin}
          queryingCategories={queryingConfigs}
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
                  queryingConfigs={queryingConfigs}
                  deprecatedCategories={deprecatedCategories}
                  rerunConfigQuery={rerunConfigQuery}
                  votingDuration={votingDuration}
                  rerunAdminQuery={rerunCheckAdmin}
                />
              } 
            />
            <Route 
              path="profile/:accountName/*"
              element={
                <RenderProfilePage
                  categories={categories}
                  isAdmin={isAdmin}
                  activeUser={props.ual.activeUser}
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