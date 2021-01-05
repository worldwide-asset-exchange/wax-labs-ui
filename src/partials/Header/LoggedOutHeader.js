import React from 'react'
import { Link } from 'react-router-dom'

import * as GLOBAL_VARS from '../../utils/vars';
import RenderSignInButton from '../SignInButton';

export default function RenderLoggedOutHeader(props){

    return (
        <div>
            <Link to={GLOBAL_VARS.PROPOSALS_LINK}>Proposals</Link>
            <RenderSignInButton loginModal={props.loginModal}/>
        </div>
    )
}