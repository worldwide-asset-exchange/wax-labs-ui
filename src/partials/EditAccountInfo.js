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
            proposal_id: '',
            proposer: '',
            title: '',
            category: '',
            description: '',
            content: '',
            total_requested_funds: '',
            deliverables_count: '',
            available_categories: []
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
                        <input type="text" name="name" value={this.state.name} />
                    </div>
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Biography:</strong>
                    </div>
                    <div className="col value">
                    <textarea name="bio" value={this.state.bio} ></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Image (url):</strong>
                    </div>
                    <div className="col value">
                        <input type="text" name="img" value={this.state.img} />
                    </div>        
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Country:</strong>    
                    </div>
                    <div className="col value">
                        <input type="text" name="country" value={this.state.country} />          
                    </div>                          
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Website:</strong>   
                    </div>
                    <div className="col value">
                        <input type="text" name="website" value={this.state.website} />               
                    </div>                         
                </div>
                <div className="row">
                    <div className="col label">
                        <strong>Telegram Handle:</strong>   
                    </div>
                    <div className="col value">
                        <input type="text" name="telegram" value={this.state.telegram} />              
                    </div>                         
                </div>
            </div>
        );
    }

}

export default RenderEditAccountInfo;