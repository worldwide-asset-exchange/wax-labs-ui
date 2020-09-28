import React from 'react';
import {
Link
} from 'react-router-dom';

import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

function RenderInReviewProposals(props) {
        return (
            <div className="account-info">
                <h2>Account Info</h2>
                <div className="account-info-table">
                    <div className="row">
                        <Link className="header-edit-button" to="account/edit">Edit</Link>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Name:</strong>
                        </div>
                        <div className="col value">
                            {props.name}
                            <Link to="account/edit">Edit</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Biography:</strong>
                        </div>
                        <div className="col value">
                            {props.bio}
                            <Link to="account/edit">Edit</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Image (url):</strong>
                        </div>
                        <div className="col value">
                            <img src={props.img} alt="Account Image" />
                            <Link to="account/edit">Edit</Link>
                        </div>        
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Country:</strong>    
                        </div>
                        <div className="col value">
                            {props.country}
                            <Link to="account/edit">Edit</Link>            
                        </div>                          
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Website:</strong>   
                        </div>
                        <div className="col value">
                            {props.website}
                            <Link to="account/edit">Edit</Link>                
                        </div>                         
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Telegram Handle:</strong>   
                        </div>
                        <div className="col value">
                            {props.telegram}
                            <Link to="account/edit">Edit</Link>                
                        </div>                         
                    </div>
                </div>
            </div>
        );
}

export default RenderInReviewProposals;