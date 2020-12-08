import React, { useState, useEffect } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import * as globals from "../utils/vars.js";

export default function RenderFilter(props){

    return (
        <React.Fragment>
            <h3>{props.title}</h3>
            <ToggleButtonGroup 
                type="checkbox"
                value={props.currentList}
                onChange={props.updateCurrentList}
            >
                {props.fullList.map((buttonName, index) => {
                    return(
                        <ToggleButton 
                            key={index}
                            value={buttonName}
                        >                    
                            {
                                props.readableNameDict ? 
                                props.readableNameDict[buttonName]
                                : buttonName
                            }
                        </ToggleButton>    
                    )
                })}
            </ToggleButtonGroup>
        </React.Fragment>
    )
}