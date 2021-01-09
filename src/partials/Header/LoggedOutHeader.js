import React from 'react'
import { Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'

import * as GLOBAL_VARS from '../../utils/vars';
import RenderSignInButton from '../SignInButton';
import labsIcon from '../../images/Header/WAXlabs-logo.svg'
import ProposalIcon from '../../icons/ProposalIcon';

export default function RenderLoggedOutHeader(props){

    return (
        <Navbar collapseOnSelect expand="lg" className="header">
            <Navbar.Brand className="header__icon" href="/">
                <img src={labsIcon} alt="WAX labs icon"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="header__toggleButton" />
            <Navbar.Collapse id="responsive-navbar-nav" className="header__collapse">
                <NavLink to={GLOBAL_VARS.PROPOSALS_LINK} className="header__link" activeClassName="header__link--active">
                    <ProposalIcon/>
                    Proposals
                </NavLink>
                <RenderSignInButton loginModal={props.loginModal}/>
            </Navbar.Collapse>
        </Navbar>
    )
}