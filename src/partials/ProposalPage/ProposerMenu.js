import React from 'react';
import { Link, useParams } from 'react-router-dom';
import * as waxjs from '@waxio/waxjs/dist';

import * as GLOBAL_VARS from '../../utils/vars';
import * as alertGlobals from '../../utils/alerts';
import { randomEosioName, requestedAmountToFloat, tagStyle } from '../../utils/util';
import { Accordion } from 'react-bootstrap';

import './ProposerMenu.scss';

const wax = new waxjs.WaxJS({ rpcEndpoint: process.env.REACT_APP_WAX_RPC ,  tryAutoLogin: false });

const BEGIN_VOTING_AMOUNT = 10;

export default function RenderProposerMenu(props) {
    const { id } = useParams();
    async function cancelProposal() {
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.CANCEL_PROPOSAL_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission,
                                },
                            ],
                            data: {
                                proposal_id: id,
                                memo: '',
                            },
                        },
                    ],
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            let body = alertGlobals.CANCEL_PROP_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id);
            let alertObj = {
                ...alertGlobals.CANCEL_PROP_ALERT_DICT.SUCCESS,
                body: body,
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...alertGlobals.CANCEL_PROP_ALERT_DICT.ERROR,
                details: e.message,
            };
            props.showAlert(alertObj);
            console.log(e);
        }
    }

    async function submitProp() {
        try {
            let activeUser = props.activeUser;
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.SUBMIT_PROPOSAL_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission,
                                },
                            ],
                            data: {
                                proposal_id: id,
                            },
                        },
                    ],
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            let body = alertGlobals.SUBMIT_PROP_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id);
            let alertObj = {
                ...alertGlobals.SUBMIT_PROP_ALERT_DICT.SUCCESS,
                body: body,
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...alertGlobals.SUBMIT_PROP_ALERT_DICT.ERROR,
                details: e.message,
            };
            props.showAlert(alertObj);
            console.log(e);
        }
    }

    async function beginVoting() {
        try {
            let activeUser = props.activeUser;
            let resp = await wax.rpc.get_table_rows({
                code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                scope: activeUser.accountName,
                table: GLOBAL_VARS.ACCOUNTS_TABLE,
                json: true,
                limit: 1,
            });

            let balanceAmount = '0.0 WAX';
            if (resp.rows.length) {
                balanceAmount = resp.rows[0].balance;
            }

            balanceAmount = requestedAmountToFloat(balanceAmount);
            let transferAction = [];

            if (balanceAmount < BEGIN_VOTING_AMOUNT) {
                transferAction = [
                    {
                        account: GLOBAL_VARS.EOSIO_TOKEN_CODE,
                        name: GLOBAL_VARS.TRANSFER_ACTION,
                        authorization: [
                            {
                                actor: activeUser.accountName,
                                permission: activeUser.requestPermission,
                            },
                        ],
                        data: {
                            from: activeUser.accountName,
                            to: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            quantity: GLOBAL_VARS.BEGIN_VOTING_AMOUNT,
                            memo: '',
                        },
                    },
                ];
            }
            let ballotName = randomEosioName(12);
            // If balanceAmount was lesser than BEGIN_VOTING_AMOUNT
            // transferAction is empty, so the spread has no effect.
            // This is so that we don't have to replicate signTransaction code.
            await activeUser.signTransaction(
                {
                    actions: [
                        ...transferAction,
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.BEGIN_VOTING_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission,
                                },
                            ],
                            data: {
                                proposal_id: id,
                                ballot_name: ballotName,
                            },
                        },
                    ],
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );

            let body = alertGlobals.BEGIN_VOTING_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id);

            let alertObj = {
                ...alertGlobals.BEGIN_VOTING_ALERT_DICT.SUCCESS,
                body: body,
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...alertGlobals.BEGIN_VOTING_ALERT_DICT.ERROR,
                details: e.message,
            };
            props.showAlert(alertObj);
            console.log(e);
        }
    }

    async function endVoting() {
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.END_VOTING_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission,
                                },
                            ],
                            data: {
                                proposal_id: id,
                            },
                        },
                    ],
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            let body = alertGlobals.END_VOTING_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id);

            let alertObj = {
                ...alertGlobals.END_VOTING_ALERT_DICT.SUCCESS,
                body: body,
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...alertGlobals.END_VOTING_ALERT_DICT.ERROR,
                details: e.message,
            };
            props.showAlert(alertObj);
            console.log(e);
        }
    }
    async function deleteProposal() {
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.DELETE_PROPOSAL_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission,
                                },
                            ],
                            data: {
                                proposal_id: id,
                            },
                        },
                    ],
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            let body = alertGlobals.DELETE_PROP_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(alertGlobals.PROPOSAL_ID_TEMPLATE, id);
            let alertObj = {
                ...alertGlobals.DELETE_PROP_ALERT_DICT.SUCCESS,
                body: body,
            };
            props.updateProposalDeleted(true);
            props.showAlert(alertObj);
        } catch (e) {
            let alertObj = {
                ...alertGlobals.DELETE_PROP_ALERT_DICT.ERROR,
                details: e.message,
            };
            props.showAlert(alertObj);
            console.log(e);
        }
    }

    function setProposerActions() {
        if (props.proposal.status === GLOBAL_VARS.DRAFTING_KEY) {
            return (
                <React.Fragment>
                    <Accordion className="proposerMenu__accordion">
                        <Accordion.Toggle as="div" eventKey="0">
                            <button className="button button--secondary">Next steps</button>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div className="proposerMenu__accordionContent">
                                <p className="proposerMenu__body">
                                    To submit your proposal to be reviewed by the admin you need to{' '}
                                    <span className="bold">add your deliverables</span> first. For that, choose{' '}
                                    <span className="bold">Edit proposal</span>.
                                </p>
                                <p className="proposerMenu__body">
                                    Once you're satisfied with all the information, you can
                                    <span className="bold">Submit proposal </span>
                                    to be reviewed by the admin.  
                                </p>
                                <p className="proposerMenu__body">
                                    Either you or the admin can also <span className="bold">Cancel proposal</span>. This
                                    will block the proposal to be edited and eventually approved. Note that you won't be
                                    refunded.
                                </p>
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                    <div className="proposerMenu__actions">
                        <Link className="button button--text" to="edit">
                            Edit proposal
                        </Link>
                        <button className="button button--text" onClick={cancelProposal}>
                            Cancel proposal
                        </button>
                        {requestedAmountToFloat(props.proposal.totalRequestedFunds) > props.minRequested ?
                            <button className="button button--primary" onClick={submitProp}>
                            Submit Proposal
                            </button>
                            : null}
                    </div>
                </React.Fragment>
            );
        } else if (props.proposal.status === GLOBAL_VARS.SUBMITTED_KEY) {
            return (
                <React.Fragment>
                    <Accordion className="proposerMenu__accordion">
                        <Accordion.Toggle as="div" eventKey="0">
                            <button className="button button--secondary">Next steps</button>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div className="proposerMenu__accordionContent">
                                <p className="proposerMenu__body">
                                    Your proposal has been submitted and is currently being reviewed by the admin. This
                                    may take a few days.
                                </p>
                                <p className="proposerMenu__body">
                                    You can still <span className="bold">Cancel proposal</span>. This will block the
                                    proposal from being reviewed. Note that you won't be refunded.
                                </p>
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                    <div className="proposerMenu__actions">
                        <button className="button button--text" onClick={cancelProposal}>
                            Cancel proposal
                        </button>
                    </div>
                </React.Fragment>
            );
        } else if (props.proposal.status === GLOBAL_VARS.FAILED_DRAFT_KEY) {
            return (
                <React.Fragment>
                    <Accordion className="proposerMenu__accordion">
                        <Accordion.Toggle as="div" eventKey="0">
                            <button className="button button--secondary">Next steps</button>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div className="proposerMenu__accordionContent">
                                <p className="proposerMenu__body">
                                    To submit again proposal to be reviewed by the admin you need to {' '}
                                    <span className="bold">modify your deliverables</span> first. For that, choose{' '}
                                    <span className="bold">Edit proposal</span>.
                                </p>
                                <p className="proposerMenu__body">
                                    Once you modify any deliverable information, the proposal's status{' '}
                                    will be changed to <span className="bold">Drafting</span> and you will be able to{" "}
                                    <span className="bold">Submit proposal </span>
                                    to be reviewed by the admin. Note that if a proposal is sent {' '}
                                    multiple times it can be rejected permanently.
                                </p>
                                <p className="proposerMenu__body">
                                    Either you or the admin can also <span className="bold">Cancel proposal</span>. This
                                    will block the proposal to be edited and eventually approved. Note that you won't be
                                    refunded.
                                </p>
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                    <div className="proposerMenu__actions">
                        <Link className="button button--text" to="edit">
                            Edit proposal
                        </Link>
                        <button className="button button--text" onClick={cancelProposal}>
                            Cancel proposal
                        </button>
                    </div>
                </React.Fragment>
            );
        } else if (props.proposal.status === GLOBAL_VARS.APPROVED_KEY) {
            return (
                <React.Fragment>
                    <Accordion className="proposerMenu__accordion">
                        <Accordion.Toggle as="div" eventKey="0">
                            <button className="button button--secondary">Next steps</button>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div className="proposerMenu__accordionContent">
                                <p className="proposerMenu__body">
                                    Your proposal has been approved by the admin. You can{' '}
                                    <span className="bold">Begin voting </span>
                                    to allow the community to vote on your proposal.
                                </p>
                                <p className="proposerMenu__body">
                                    You can still <span className="bold">Cancel proposal</span>. This will block the
                                    proposal from being voted. Note that you won't be refunded.
                                </p>
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                    <div className="proposerMenu__actions">
                        <button className="button button--text" onClick={cancelProposal}>
                            Cancel Proposal
                        </button>
                        <button className="button button--primary" onClick={beginVoting}>
                            Begin Voting
                        </button>
                    </div>
                </React.Fragment>
            );
        } else if (props.proposal.status === GLOBAL_VARS.VOTING_KEY) {
            return (
                <React.Fragment>
                    <Accordion className="proposerMenu__accordion">
                        <Accordion.Toggle as="div" eventKey="0">
                            <button className="button button--secondary">Next steps</button>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div className="proposerMenu__accordionContent">
                                {!props.votingEndsIn.includes('ago') ? (
                                    <p className="proposerMenu__body">
                                        Your proposal is currently being voted on by the community. You'll need to wait
                                        for the voting period to end.
                                    </p>
                                ) : (
                                    ''
                                )}
                                {props.votingEndsIn.includes('ago') ? (
                                    <p className="proposerMenu__body">
                                        You can <span className="bold">End voting</span> to confirm your acceptance of
                                        the voting result. Once you take this action, your proposal will either be moved
                                        to rejected or in progress, according to the voting.
                                    </p>
                                ) : (
                                    ''
                                )}
                                <p className="proposerMenu__body">
                                    You can still <span className="bold">Cancel proposal</span>. This will mark your
                                    proposal as cancelled.
                                </p>
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                    <div className="proposerMenu__actions">
                        <button className="button button--text" onClick={cancelProposal}>
                            Cancel Proposal
                        </button>
                        {props.votingEndsIn.includes('ago') ? (
                            <button className="button button--primary" onClick={endVoting}>
                                End Voting
                            </button>
                        ) : (
                            ''
                        )}
                    </div>
                </React.Fragment>
            );
        } else if (
            [GLOBAL_VARS.CANCELLED_KEY, GLOBAL_VARS.FAILED_KEY, GLOBAL_VARS.COMPLETED_KEY].includes(
                props.proposal.status
            )
        ) {
            return (
                <React.Fragment>
                    <Accordion className="proposerMenu__accordion">
                        <Accordion.Toggle as="div" eventKey="0">
                            <button className="button button--secondary">Next steps</button>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div className="proposerMenu__accordionContent">
                                <p className="proposerMenu__body">
                                    Your proposal has reached the end of its lifecycle.
                                </p>
                                <p className="proposerMenu__body">
                                    You can <span className="bold">Delete proposal</span>. This will remove your
                                    proposal from the blockchain.
                                </p>
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                    <div className="proposerMenu__actions">
                        <button className="button button--primary" onClick={deleteProposal}>
                            Delete Proposal
                        </button>
                    </div>
                </React.Fragment>
            );
        } else if (props.proposal.status === GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY) {
            return (
                <React.Fragment>
                    <Accordion.Toggle as="div" eventKey="0">
                        <button className="button button--secondary">Next steps</button>
                    </Accordion.Toggle>
                    <Accordion className="proposerMenu__accordion">
                        <Accordion.Collapse eventKey="0">
                            <p className="proposerMenu__body">
                                To <span className="bold">update a deliverable</span> click on the "Submit report"
                                button, and enter a link that proves the deliverable is complete, so that the assigned
                                reviewer can approve your work. You will be able to claim the requested funds of each
                                individual deliverable separetely, as soon as each is accepted.
                            </p>
                        </Accordion.Collapse>
                    </Accordion>
                </React.Fragment>
            );
        }
    }
    // check if activeUser is the same as the proposal's proposer.
    if (props.activeUser && props.activeUser.accountName === props.proposal.proposer) {
        return (
            <div className="proposerMenu">
                <h4>
                    Proposer, your proposal is{' '}
                    <span className={`tag ${tagStyle(props.proposal.status)}`}>
                        {GLOBAL_VARS.READABLE_PROPOSAL_STATUS[props.proposal.status]}
                    </span>
                </h4>
                {setProposerActions()}
            </div>
        )
    }
    // If none of the returns were reached, return null.
    return null;
}
