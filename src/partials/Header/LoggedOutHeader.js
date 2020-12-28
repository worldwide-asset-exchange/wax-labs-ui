import React from 'react'
import { Link } from 'react-router-dom'

import * as GLOBAL_VARS from '../../utils/vars';

export default function RenderLoggedOutHeader(props){

    return (
        <div>
            <Link to={GLOBAL_VARS.PROPOSALS_LINK}>Proposals</Link>
            <button className="btn" onClick={props.loginModal}>Sign in</button>
        </div>
    )
}