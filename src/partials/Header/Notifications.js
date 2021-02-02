import React from 'react';
import DropDown from 'react-bootstrap/Dropdown'
import { Link } from 'react-router-dom'

import * as GLOBAL_VARS from '../../utils/vars'
import BellIcon from '../../icons/BellIcon'
import RingingBellIcon from '../../icons/RingingBellIcon'

import './Notifications.scss'

export default function RenderNotifications (props){

    function RenderNotificationButton() {
        if (props.notifications.length) {
            return (
                <React.Fragment>
                    <RingingBellIcon/>
                    <h4>Notifications <span>({props.notifications.length})</span></h4>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <BellIcon/>
                    <h4>Notifications</h4>
                </React.Fragment>
            )
        }
    }



        return (
            <div className="notifications">
            <DropDown>
                <DropDown.Toggle bsPrefix="notifications__icon" id="dropdown-basic">
                    {
                        props.querying ?
                        <React.Fragment>
                            <BellIcon/>
                            <h4>Loading...</h4>
                        </React.Fragment>
                        :
                        RenderNotificationButton()
                    }
                </DropDown.Toggle>
                <DropDown.Menu className="notifications__openDropdown">
                    <ul className="notifications__list">
                    {
                        props.notifications.length ?
                            props.notifications.map( (notification, index) => {
                                return (
                                    <li className="notifications__notification" key={index}>
                                        <Link
                                            to={GLOBAL_VARS.PROPOSALS_LINK + "/" + notification.id}
                                            className="notifications__link"
                                        >
                                            <div className="notifications__id">Proposal #{notification.id}</div>
                                            <div className="notifications__text">{notification.text}</div>
                                        </Link>
                                    </li>
                                )
                            }) :
                            <li className="notifications__notification notifications__notification--none">
                                <p>You don't have any notifications.</p>
                            </li>
                    }
                    </ul>
                </DropDown.Menu>
            </DropDown>

        </div>
    )
}
