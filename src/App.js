import React from 'react';
import {
Routes,
Route,
} from 'react-router-dom'

import './App.css';
import RenderHome from './pages/Home.js';
import RenderErrorPage from './pages/ErrorPage.js';
import RenderAccountPortal from './pages/AccountPortal.js';
import RenderProposals from './pages/Proposals.js';
import RenderAdminPortal from './pages/AdminPortal.js'; 

import RenderFooter from './partials/Footer.js';
import RenderHeader from './partials/Header.js';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeUser: null,
      isAdmin: false,
    };

    this.updateAccountName = this.updateAccountName.bind(this);
  }

  componentDidUpdate() {
    const { ual: { activeUser } } = this.props;
    if (activeUser && !this.state.activeUser) {
      this.setState({ activeUser }, this.updateAccountName);
    } else if (!activeUser && this.state.activeUser) {
      this.setState({
          activeUser: null,
          accountName: ''
      });
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
            <Route path="proposals/*" element={<RenderProposals />} />
            <Route path="account/*" element={<RenderAccountPortal accountName={this.state.accountName} />} />
            <Route path="admin/*" element={<RenderAdminPortal />} />
            <Route path="*" element={<RenderErrorPage />} />
          </Routes>
        </main>
        <RenderFooter activeUser={this.props.ual.activeUser} activeAuthenticator={this.props.ual.activeAuthenticator} />
      </div>
    );
  }
}

export default App;