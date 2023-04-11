import { Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import * as GLOBAL_VARS from '../../utils/vars';
import RenderSignInButton from '../SignInButton';
import labsIcon from '../../images/Header/WAXlabs-logo.svg';
import { ReactComponent as ProposalIcon } from '../../icons/ProposalIcon.svg';

export default function RenderLoggedOutHeader(props) {
    return (
        <Navbar
            collapseOnSelect
            expand="xl"
            className="header"
        >
            <Navbar.Brand
                className="header__icon"
                href="/"
            >
                <img
                    src={labsIcon}
                    alt="WAX labs icon"
                />
            </Navbar.Brand>
            <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="header__toggleButton"
            />
            <Navbar.Collapse
                id="responsive-navbar-nav"
                className="header__collapse"
            >
                <NavLink
                    to={GLOBAL_VARS.PROPOSALS_HEADER_LINK}
                    className={({ isActive }) =>
                        isActive ? 'header__link header__link--active' : 'header__link'
                    }
                >
                    <ProposalIcon />
                    Proposals
                </NavLink>
                <RenderSignInButton loginModal={props.loginModal} />
            </Navbar.Collapse>
        </Navbar>
    );
}
