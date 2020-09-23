import React from 'react';
import {
Switch,
Route,
} from 'react-router-dom'

import './App.css';
import RenderHome from './pages/Home.js';
import RenderErrorPage from './pages/ErrorPage.js';

import RenderFooter from './partials/Footer.js';
import RenderHeader from './partials/Header.js';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeUser: null,
      accountName: '',
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
      const accountName = await this.state.activeUser.getAccountName();
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
        <RenderHeader showModal={this.props.ual.showModal} activeUser={this.props.ual.activeUser} activeAuthenticator={this.props.ual.activeAuthenticator} logout={this.props.ual.logout} />
          <Switch>
            <Route exact path="/">
              <RenderHome />
            </Route>
            <Route path="*">
              <RenderErrorPage />
            </Route>
          </Switch>
          <RenderFooter />
      </div>
    );
  }
}

export default App;