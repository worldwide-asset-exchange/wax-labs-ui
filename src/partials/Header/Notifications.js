import React from 'react';

export default function RenderNotifications (props){
    return (
        <div>
            {props.notifications.length}
            Notifications
        </div>
    )
}
