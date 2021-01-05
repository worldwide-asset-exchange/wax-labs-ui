import React from 'react';
import DropDown from 'react-bootstrap/Dropdown'
import { Link } from 'react-router-dom'

import * as GLOBAL_VARS from '../../utils/vars'

export default function RenderNotifications (props){
    return (
        <div>
            <DropDown>
                <DropDown.Toggle variant="success" id="dropdown-basic">
                    {props.querying ? "Loading " : props.notifications.length + " "}
                    Notifications
                </DropDown.Toggle>
                <DropDown.Menu>
                    {props.notifications.map( (notification, index) => {
                        return (
                            <Link 
                                key={index}
                                to={GLOBAL_VARS.PROPOSALS_LINK + "/" + notification.id}
                            >
                                {notification.text}
                            </Link>
                        )
                    })}
                </DropDown.Menu>
            </DropDown>

        </div>
    )
}
