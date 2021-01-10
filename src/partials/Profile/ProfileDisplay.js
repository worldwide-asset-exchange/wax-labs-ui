import React from 'react';

export default function RenderProfileDisplay(props){

    if(props.profile){
        return (
            <div>
                <img 
                    src={props.profile.image_url}
                    alt="User provided"
                />
                <div>
                    <h2>Full name</h2>
                    <h5>{props.profile.full_name}</h5>
                </div>
                <div>
                    <h2>Biography</h2>
                    <h5>{props.profile.bio}</h5>
                </div>
                <div>
                    <h2>Country</h2>
                    <h5>{props.profile.country}</h5>
                </div>
                <div>
                    <h2>Website</h2>
                    <h5>{props.profile.website}</h5>
                </div>
                <div>
                    <h2>Telegram handle</h2>
                    <h5>{props.profile.contact}</h5>
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