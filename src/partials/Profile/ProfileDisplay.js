import React from 'react';
import './ProfileDisplay.scss';

export default function RenderProfileDisplay(props){

    if(props.profile){
        return (
            <div className="profileDisplay">
                <img
                    src={props.profile.image_url}
                    alt="User provided"
                    className="profileDisplay__image"
                />
                <div className="profileDisplay__information">
                    <div className="profileDisplay__label">Full name</div>
                    <h5 className="profileDisplay__data">{props.profile.full_name}</h5>
                </div>
                <div className="profileDisplay__information">
                    <div className="profileDisplay__label">Biography</div>
                    <h5 className="profileDisplay__data">{props.profile.bio}</h5>
                </div>
                <div className="profileDisplay__information">
                    <div className="profileDisplay__label">Country</div>
                    <h5 className="profileDisplay__data">{props.profile.country}</h5>
                </div>
                <div className="profileDisplay__information">
                    <div className="profileDisplay__label">Website</div>
                    <h5 className="profileDisplay__data">{props.profile.website}</h5>
                </div>
                <div className="profileDisplay__information">
                    <div className="profileDisplay__label">Telegram handle</div>
                    <h5 className="profileDisplay__data">{props.profile.contact}</h5>
                </div>
            </div>
        )
    }

    return(
        <div>
            {props.notFoundMessage}
        </div>
    )

}