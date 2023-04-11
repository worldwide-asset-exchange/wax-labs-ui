import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as waxjs from '@waxio/waxjs/dist';
import * as GLOBAL_VARS from '../utils/vars';

import GenericProposals from '../partials/GenericProposals';
import RenderProposalPage from './ProposalPage';
import RenderEditProposal from '../partials/EditPage/EditProposal';
import RenderCreateProposalPage from '../partials/CreateProposalPage/CreateProposalPage';

import './Proposals.scss';
import RenderErrorPage from './ErrorPage';

const wax = new waxjs.WaxJS({ rpcEndpoint: process.env.REACT_APP_WAX_RPC, tryAutoLogin: false });

export default function RenderProposals(props) {
    const [profile, setProfile] = useState(null);

    let categories = props.categories;
    useEffect(() => {
        let cancelled = false;
        async function getProfile() {
            try {
                let resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    table: GLOBAL_VARS.PROFILES_TABLE,
                    lower_bound: props.activeUser.accountName,
                    upper_bound: props.activeUser.accountName,
                    json: true,
                    limit: 1
                });
                if (!cancelled) {
                    if (resp.rows.length) {
                        setProfile(resp.rows[0]);
                    } else {
                        setProfile(null);
                    }
                }
            } catch (e) {
                console.debug(e);
            }
        }
        if (props.activeUser) {
            getProfile();
        }

        const cleanup = () => {
            cancelled = true;
        };
        return cleanup;
    }, [props.activeUser]);

    return (
        <div className="proposals">
            <Routes>
                <Route
                    path="/"
                    element={
                        <GenericProposals
                            noProposalsMessage="The list for these filters is empty. Try changing the filters."
                            categories={categories}
                            profile={profile}
                            showCreateButton
                            activeUser={props.activeUser}
                            loginModal={props.loginModal}
                            defaultStatus={[
                                GLOBAL_VARS.VOTING_KEY,
                                GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY
                            ]}
                            subtitle={'Proposals'}
                        />
                    }
                />
                <Route
                    path="/:id"
                    element={
                        <RenderProposalPage
                            activeUser={props.activeUser}
                            isAdmin={props.isAdmin}
                            categories={categories}
                            loginModal={props.loginModal}
                            minRequested={props.minRequested}
                            waxUsdPrice={props.waxUsdPrice}
                            loadWaxUsdPrice={props.loadWaxUsdPrice}
                            queryingAvailableFunds={props.queryingAvailableFunds}
                            availableFunds={props.availableFunds}
                        />
                    }
                />
                <Route
                    path="create"
                    element={
                        <RenderCreateProposalPage
                            activeUser={props.activeUser}
                            categories={categories}
                            deprecatedCategories={props.deprecatedCategories}
                            queryingMinMaxRequested={props.queryingMinMaxRequested}
                            minRequested={props.minRequested}
                            maxRequested={props.maxRequested}
                        />
                    }
                />
                <Route
                    path=":id/edit"
                    element={
                        <RenderEditProposal
                            activeUser={props.activeUser}
                            categories={categories}
                            deprecatedCategories={props.deprecatedCategories}
                            queryingMinMaxRequested={props.queryingMinMaxRequested}
                            minRequested={props.minRequested}
                            maxRequested={props.maxRequested}
                            waxUsdPrice={props.waxUsdPrice}
                            loadWaxUsdPrice={props.loadWaxUsdPrice}
                        />
                    }
                />
                <Route
                    path="/*"
                    element={<RenderErrorPage />}
                />
            </Routes>
        </div>
    );
}
