import React from 'react';
import {
Routes,
Route,
Link
} from 'react-router-dom';

import RenderAccountInfo from '../partials/AccountInfo.js';
import RenderEditAccountInfo from '../partials/EditAccountInfo.js';

class RenderAccountPortal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            bio: '',
            img: '',
            country: '',
            website: '',
            telegram: ''
        }
        this.getAccountInfo = this.getAccountInfo.bind(this);
    }

    async getAccountInfo(){

    }

    render(){
    return (
            <div className="proposals">
                <div className="proposals-filter">
                    <h3>Hello, ACCOUNT_NAME!</h3>
                    <ul>
                        <li><Link to="/account">Account Info</Link></li>
                        <li><Link to="/my-proposals">My Proposals</Link></li>
                    </ul>
                </div>
                <div className="account-body">
                    <Routes>
                        <Route path="/" element={<RenderAccountInfo />} name={this.state.name} bio={this.state.bio} img={this.state.img} country={this.state.country} website={this.state.website} telegram={this.state.telegram} />
                        <Route path="edit" element={<RenderEditAccountInfo />} name={this.state.name} bio={this.state.bio} img={this.state.img} country={this.state.country} website={this.state.website} telegram={this.state.telegram} />
                    </Routes>
                </div>
            </div>
        );
    }
}

export default RenderAccountPortal;