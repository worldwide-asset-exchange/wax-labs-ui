import React, {useState} from 'react';
import './ProfileDisplay.scss';
import * as GLOBAL_VARS from '../../utils/vars';

export default function RenderProfileDisplay(props){
    const [imageError, setImageError] = useState(false);
    if(props.profile){
        return (
            <div className="profileDisplay">
                <img
                    src={imageError ? GLOBAL_VARS.DEFAULT_PROPOSAL_IMAGE_URL : props.profile.image_url}
                    alt="User provided"
                    className="profileDisplay__image"
                    onError={()=> setImageError(true)}
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