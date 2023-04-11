import * as React from 'react';
import { Link } from 'react-router-dom';
import * as GLOBAL_VARS from '../utils/vars';

import './ErrorPage.scss';

function RenderErrorPage() {
    return (
        <div className="errorPage">
            <div className="errorPage__content">
                <h3>We couldn't find what you're looking for.</h3>
                <p>
                    It might not exist anymore or this is not the place. We recommend that you
                    browse through the existing proposals.
                </p>
                <Link
                    to={GLOBAL_VARS.PROPOSALS_LINK}
                    className="button button--primary"
                >
                    Look for proposals
                </Link>
            </div>
            <h1 className="errorPage__404">404</h1>
        </div>
    );
}

export default RenderErrorPage;
