import { useState } from 'react';
import { Link } from 'react-router-dom';
import RenderProposalInputContainer from '../EditPage/ProposalInputContainer';
import * as waxjs from '@waxio/waxjs/dist';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';

import { requestedAmountToFloat } from '../../utils/util';

import RenderAlerts from '../Alerts/Alerts';
import './CreateProposalPage.scss';

const wax = new waxjs.WaxJS({ rpcEndpoint: process.env.REACT_APP_WAX_RPC, tryAutoLogin: false });

export default function RenderCreateProposalPage(props) {
    const [allValid, setAllValid] = useState(true);
    const [proposal, setProposal] = useState(null);
    const [showValidatorMessages, setShowValidatorMessages] = useState(0);
    const [alertList, setAlertList] = useState([]);
    const [transactionId, setTransactionId] = useState(null);

    function updateProposal(proposal) {
        setProposal(proposal);
    }
    function updateAllValid(allValid) {
        setAllValid(allValid);
    }
    function showAlert(alertObj) {
        // Make a copy.
        let alerts = alertList.slice(0);
        // Push new alert to the copied list
        alerts.push(alertObj);
        // Update the list.
        setAlertList(alerts);
    }
    function removeAlert(index) {
        // Make a copy.
        let alerts = alertList.slice(0);
        // remove alert at index.
        alerts.splice(index, 1);
        // Update the list.
        setAlertList(alerts);
    }

    async function createProposal() {
        let activeUser = props.activeUser;
        if (!allValid) {
            showAlert(GLOBAL_ALERTS.INVALID_DATA_ALERT_DICT.WARN);
            setShowValidatorMessages(showValidatorMessages + 1);
            return;
        }
        let resp = await wax.rpc.get_table_rows({
            code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            scope: activeUser.accountName,
            table: GLOBAL_VARS.ACCOUNTS_TABLE,
            json: true,
            limit: 1
        });
        let balanceAmount = '0.0 WAX';
        if (resp.rows.length) {
            balanceAmount = resp.rows[0].balance;
        }
        balanceAmount = requestedAmountToFloat(balanceAmount);
        let transferAction = [];

        if (balanceAmount < requestedAmountToFloat(GLOBAL_VARS.DRAFT_PROP_AMOUNT)) {
            transferAction = [
                {
                    account: GLOBAL_VARS.EOSIO_TOKEN_CODE,
                    name: GLOBAL_VARS.TRANSFER_ACTION,
                    authorization: [
                        {
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission
                        }
                    ],
                    data: {
                        from: activeUser.accountName,
                        to: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        quantity: GLOBAL_VARS.DRAFT_PROP_AMOUNT,
                        memo: ''
                    }
                }
            ];
        }

        try {
            let resp = await activeUser.signTransaction(
                {
                    actions: [
                        ...transferAction,
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.DRAFT_PROPOSAL_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission
                                }
                            ],
                            data: {
                                proposer: activeUser.accountName,
                                category: proposal.category,
                                title: proposal.title,
                                description: proposal.description,
                                image_url: proposal.image_url,
                                estimated_time: proposal.estimated_time,
                                mdbody: proposal.content,
                                deliverables_count: proposal.deliverables,
                                road_map: proposal.road_map
                            }
                        }
                    ]
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            let alertObj = {
                ...GLOBAL_ALERTS.DRAFT_PROP_ALERT_DICT.SUCCESS
            };
            setTransactionId(resp.transaction.transaction_id);
            showAlert(alertObj);
        } catch (e) {
            let alertObj = {
                ...GLOBAL_ALERTS.DRAFT_PROP_ALERT_DICT.ERROR,
                details: e.message
            };
            showAlert(alertObj);
            console.debug(e);
        }
    }

    if (!props.activeUser) {
        return (
            <div className="createProposal">
                <h1>Sign in to create a proposal.</h1>
            </div>
        );
    }

    if (transactionId) {
        return (
            <div className="createProposal">
                <h1> Proposal created successfully </h1>
                <p>
                    Transaction link{' '}
                    <a
                        className="inlineLink"
                        target="__blank"
                        href={`https://wax${
                            props.activeUser.chainId === GLOBAL_VARS.TESTNET_CHAIN_ID ? '-test' : ''
                        }.bloks.io/transaction/${transactionId}`}
                    >
                        {transactionId.slice(0, 8)}
                    </a>
                </p>
                <h3>
                    Now you can finish your proposal by editing it and adding your deliverables.
                </h3>
                <p>
                    {' '}
                    Find your proposal in the my proposals tab within your portal or click the
                    button below.
                </p>
                <Link
                    className="button button--primary"
                    to={GLOBAL_VARS.MY_PROPOSALS_LINK}
                >
                    Go to my proposals
                </Link>
            </div>
        );
    }

    return (
        <div className="createProposal">
            <RenderAlerts
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <RenderProposalInputContainer
                hideTotalRequested
                categories={props.categories}
                deprecatedCategories={props.deprecatedCategories}
                totalRequestedFunds={0}
                updateEditableProposal={updateProposal}
                activeUser={props.activeUser}
                showValidatorMessages={showValidatorMessages}
                updateValidatorData={updateAllValid}
                queryingMinMaxRequested={props.queryingMinMaxRequested}
                minRequested={props.minRequested}
                maxRequested={props.maxRequested}
            />
            <button
                className="button button--primary"
                onClick={createProposal}
            >
                Create Proposal
            </button>
        </div>
    );
}
