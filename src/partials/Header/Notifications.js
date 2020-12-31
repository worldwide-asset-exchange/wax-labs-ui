import React from 'react';
import DropDown from 'react-bootstrap/Dropdown'

export default function RenderNotifications (props){
    return (
        <div>
            <DropDown>
                <DropDown.Toggle variant="success" id="dropdown-basic">
                    {props.querying ? "Loading " : props.notifications.length + " "}
                    Notifications
                </DropDown.Toggle>
                <DropDown.Menu>
                    {props.notifications.map( notification => {
                        return (
                            <DropDown.Item 
                                href={"proposals/" + notification.id}
                            >
                                {notification.text}
                            </DropDown.Item>
                        )
                    })}
                </DropDown.Menu>
            </DropDown>

        </div>
    )
}
