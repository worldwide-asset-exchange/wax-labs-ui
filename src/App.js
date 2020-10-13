import React from 'react';
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

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeUser: null,
      isAdmin: false,
    };

    this.updateAccountName = this.updateAccountName.bind(this);
    this.checkAdmin = this.checkAdmin.bind(this);
  }

  componentDidUpdate() {
    const { ual: { activeUser } } = this.props;
    if (activeUser && !this.state.activeUser) {
      this.setState({ activeUser }, this.updateAccountName);
      this.checkAdmin();
    } else if (!activeUser && this.state.activeUser) {
      this.setState({
          activeUser: null,
          accountName: '',
      });
    }
  }

  async checkAdmin(){
    try {
      let resp = await wax.rpc.get_table_rows({             
          code: 'labs.decide',
          scope: 'labs.decide',
          table: 'config',
          json: true
      });

      if (resp.rows[0].admin_acct === this.state.activeUser.accountName){
        this.setState({
          isAdmin: true
        });
      }

    } catch(e) {
      console.log(e);
    }
  }

  async updateAccountName(): Promise<void> {
    try {
      const accountName = await this.props.ual.activeUser.getAccountName();
      this.setState({ accountName });
    } catch (e) {
      console.warn(e);
    }
  }

  renderLogoutBtn = () => {
    const { ual: { activeUser, activeAuthenticator, logout } } = this.props
    if (activeUser && activeAuthenticator) {
      return (
          <span className='logoutBtn' onClick={logout}>
            {'Logout'}
          </span>
      )
    }
  }

  render(){
    return (
      <div className="App">
        <RenderHeader showModal={this.props.ual.showModal} accountName={this.state.accountName} activeUser={this.props.ual.activeUser} activeAuthenticator={this.props.ual.activeAuthenticator} logout={this.props.ual.logout} isAdmin={this.state.isAdmin} />
        <main>
          <Routes>
            <Route path="/" element={<RenderHome/>} />
            <Route path="proposals/*" element={<RenderProposals accountName={this.state.accountName} activeUser={this.props.ual.activeUser} isAdmin={this.state.isAdmin} />} />
            <Route path="account/*" element={<RenderAccountPortal accountName={this.state.accountName} />} />
            <Route path="admin/*" element={<RenderAdminPortal accountName={this.state.accountName} activeUser={this.props.ual.activeUser} isAdmin={this.state.isAdmin} />} />
            <Route path="*" element={<RenderErrorPage />} />
          </Routes>
        </main>
        <RenderFooter activeUser={this.props.ual.activeUser} activeAuthenticator={this.props.ual.activeAuthenticator} />
      </div>
    );
  }
}

export default App;