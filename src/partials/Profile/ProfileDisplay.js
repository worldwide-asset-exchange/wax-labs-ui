import React from 'react';

export default function RenderProfileDisplay(props){

    if(props.profile){
        return (
            <div>
                {props.profile.full_name}
            </div>
        )
    }

    return(
        <div>
            {props.notFoundMessage}
        </div>
    )

}