import * as React from 'react';
import {
  Link,
} from "react-router-dom";

function RenderHeader(props) {
    console.log(props);
    if (props.activeUser && props.activeAuthenticator) {
        return (
            <header>
                <nav>
                    <button id="menu-icon"></button>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li className="login-li">
                            <span className="accHeader">Account</span>
                            <span className="accName">{props.accountName}</span>
                            <span className='logoutBtn' onClick={props.logout}>{'Logout'}</span>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    } else {
        return (
            <header>
                <nav>
                    <button id="menu-icon"></button>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li className="login-li"><button id="login" className="login-btn" onClick= {props.showModal}>Login</button></li>
                    </ul>
                </nav>
            </header>
        );
    }

}

export default RenderHeader;