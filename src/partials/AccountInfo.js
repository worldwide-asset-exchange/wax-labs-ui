import React from 'react';
import {
Link
} from 'react-router-dom';

export default function RenderInReviewProposals(props) {
        return (
            <div className="account-info">
                <div className="account-info-table">
                    <div className="row">
                        <Link className="header-edit-button" to="edit">Edit</Link>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Name:</strong>
                        </div>
                        <div className="col value">
                            {props.full_name}
                            <Link to="edit">Edit</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Biography:</strong>
                        </div>
                        <div className="col value">
                            {props.bio}
                            <Link to="edit">Edit</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Image (url):</strong>
                        </div>
                        <div className="col value">
                            <img src={props.image_url} alt="" />
                            <Link to="edit">Edit</Link>
                        </div>        
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Country:</strong>    
                        </div>
                        <div className="col value">
                            {props.country}
                            <Link to="edit">Edit</Link>            
                        </div>                          
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Website:</strong>   
                        </div>
                        <div className="col value">
                            {props.website}
                            <Link to="edit">Edit</Link>                
                        </div>                         
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Telegram Handle:</strong>   
                        </div>
                        <div className="col value">
                            {props.contact}
                            <Link to="edit">Edit</Link>                
                        </div>                         
                    </div>
                </div>
            </div>
        );
}