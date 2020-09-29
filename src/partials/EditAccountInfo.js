import React from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class RenderEditAccountInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            wax_account: '',
            full_name: '',
            country: '',
            bio: '',
            image_url: '',
            website: '',
            contact: ''
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            [name]: value,
            }), () => { }
        );
        console.log(this.state);
    }

    render(){
        return (
            <div className="filtered-proposals edit-proposal">
                <h2>Edit Account Info</h2>
                <div className="row">
                    <div className="col label">
                        <strong>Name:</strong>
                    </div>
                    <div className="col value">
                        <input type="text" name="full_name" value={this.state.name} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Biography:</strong>
                    </div>
                    <div className="col value">
                    <textarea name="bio" value={this.state.bio} onChange={this.handleInputChange} ></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Image (url):</strong>
                    </div>
                    <div className="col value">
                        <input type="text" name="image_url" value={this.state.img} onChange={this.handleInputChange} />
                    </div>        
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Country:</strong>    
                    </div>
                    <div className="col value">
                        <input type="text" name="country" value={this.state.country} onChange={this.handleInputChange} />          
                    </div>                          
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Website:</strong>   
                    </div>
                    <div className="col value">
                        <input type="text" name="website" value={this.state.website} onChange={this.handleInputChange} />               
                    </div>                         
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Telegram Handle:</strong>   
                    </div>
                    <div className="col value">
                        <input type="text" name="contact" value={this.state.telegram} onChange={this.handleInputChange} />              
                    </div>                         
                </div>
                <div className="row">
                    <button className="submit">Update Profile</button>
                </div>
            </div>
        );
    }

}

export default RenderEditAccountInfo;