import React, {useState} from 'react';
import Carousel from 'react-bootstrap/Carousel'

import * as GLOBAL_VARS from '../utils/vars';

export default function RenderCarouselItem(props){
    const [error, setError] = useState(false);
    return(
        <Carousel.Item>
            <img src={error ? GLOBAL_VARS.DEFAULT_PROPOSAL_IMAGE_URL : props.proposal.image_url} alt={props.proposal.title} className="d-block w-100" onError={()=>setError(true)}/>
            <Carousel.Caption>
                <p>{props.proposal.title}</p>
            </Carousel.Caption>
        </Carousel.Item>
    )
}