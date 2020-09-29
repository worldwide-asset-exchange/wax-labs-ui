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
            full_name: '',
            bio: '',
            image_url: '',
            country: '',
            website: '',
            contact: ''
        }
        this.getAccountInfo = this.getAccountInfo.bind(this);
    }

    async getAccountInfo(){

    }

    render(){
    return (
            <div className="account-portal">
                <div className="account-menu">
                    <h3>Hello, {this.props.accountName}</h3>
                    <ul>
                        <li><Link to="/account">Account Info</Link></li>
                        <li><Link to="/my-proposals">My Proposals</Link></li>
                    </ul>
                </div>
                <div className="account-body">
                    <Routes>
                        <Route path="/" element={<RenderAccountInfo full_name={this.state.full_name} bio={this.state.bio} image_url={this.state.image_url} country={this.state.country} website={this.state.website} contact={this.state.contact} wax_account={this.state.wax_account} />} />
                        <Route path="edit" element={<RenderEditAccountInfo full_name={this.state.full_name} bio={this.state.bio} image_url={this.state.image_url} country={this.state.country} website={this.state.website} contact={this.state.contact} wax_account={this.state.wax_account} />} />
                    </Routes>
                </div>
            </div>
        );
    }
}

export default RenderAccountPortal;