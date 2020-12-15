import React from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

import './Filter.scss';

export default function RenderFilter(props){

    return (
        <div className="filter">
            <div className="filter__label">{props.title}</div>
            <ToggleButtonGroup
                type="checkbox"
                value={props.currentList}
                onChange={props.updateCurrentList}
                className="filter__group"
            >
                {props.fullList.map((buttonName, index) => {
                    return(
                        <ToggleButton
                            key={index}
                            value={buttonName}
                            bsPrefix="filter__item"
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
        </div>
    )
}