import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';

import { Accordion } from 'react-bootstrap';

import './AdminMenu.scss';

export default function RenderAdminMenu(props) {
    const [showReviewerModal, setShowReviewerModal] = useState(false);
    const [reviewerAccountName, setReviwerAccountName] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    const { id } = useParams();

    function toggleShowReviewerModal(show) {
        setShowReviewerModal(show);
    }
    function handleReviewerChange(event) {
        setReviwerAccountName(event.target.value);
    }

    useEffect(() => {
        if (props.activeUser) {
            setReviwerAccountName(props.activeUser.accountName);
        }
    }, [props.activeUser]);

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
                                    permission: activeUser.requestPermission
                                }
                            ],
                            data: {
                                proposal_id: id
                            }
                        }
                    ]
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            let body = GLOBAL_ALERTS.END_VOTING_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(GLOBAL_ALERTS.PROPOSAL_ID_TEMPLATE, id);

            let alertObj = {
                ...GLOBAL_ALERTS.END_VOTING_ALERT_DICT.SUCCESS,
                body: body
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...GLOBAL_ALERTS.END_VOTING_ALERT_DICT.ERROR,
                details: e.message
            };
            props.showAlert(alertObj);
            console.debug(e);
        }
    }

    async function skipVoting() {
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.SKIP_VOTING_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission
                                }
                            ],
                            data: {
                                proposal_id: id,
                                memo: ''
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
                ...GLOBAL_ALERTS.SKIP_VOTING_ALERT_DICT.SUCCESS
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...GLOBAL_ALERTS.SKIP_VOTING_ALERT_DICT.ERROR,
                details: e.message
            };
            props.showAlert(alertObj);
            console.debug(e);
        }
    }

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
                                    permission: activeUser.requestPermission
                                }
                            ],
                            data: {
                                proposal_id: id,
                                memo: ''
                            }
                        }
                    ]
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            let body = GLOBAL_ALERTS.CANCEL_PROP_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(GLOBAL_ALERTS.PROPOSAL_ID_TEMPLATE, id);
            let alertObj = {
                ...GLOBAL_ALERTS.CANCEL_PROP_ALERT_DICT.SUCCESS,
                body: body
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...GLOBAL_ALERTS.CANCEL_PROP_ALERT_DICT.ERROR,
                details: e.message
            };
            props.showAlert(alertObj);
            console.debug(e);
        }
    }

    async function reviewProposal(approve, edit) {
        let activeUser = props.activeUser;
        let alertObj = {};

        if (!approve && !rejectionReason) {
            alertObj = {
                ...GLOBAL_ALERTS.NO_REJECTION_REASON_ALERT_DICT.WARN
            };
            props.showAlert(alertObj);
            return;
        }

        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.REVIEW_PROPOSAL_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission
                                }
                            ],
                            data: {
                                proposal_id: id,
                                approve: approve,
                                draft: edit,
                                memo: approve ? '' : rejectionReason
                            }
                        }
                    ]
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            alertObj = {
                ...GLOBAL_ALERTS.REVIEW_PROP_ALERT_DICT.SUCCESS,
                body: GLOBAL_ALERTS.REVIEW_PROP_ALERT_DICT.SUCCESS.body
                    .slice()
                    .replace(GLOBAL_ALERTS.APPROVE_TEMPLATE, approve ? 'aproved' : 'rejected')
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...GLOBAL_ALERTS.REVIEW_PROP_ALERT_DICT.ERROR,
                details: e.message
            };
            props.showAlert(alertObj);
            console.debug(e);
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
                                    permission: activeUser.requestPermission
                                }
                            ],
                            data: {
                                proposal_id: id
                            }
                        }
                    ]
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            let body = GLOBAL_ALERTS.DELETE_PROP_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace(GLOBAL_ALERTS.PROPOSAL_ID_TEMPLATE, id);
            let alertObj = {
                ...GLOBAL_ALERTS.DELETE_PROP_ALERT_DICT.SUCCESS,
                body: body
            };
            props.updateProposalDeleted(true);
            props.showAlert(alertObj);
        } catch (e) {
            let alertObj = {
                ...GLOBAL_ALERTS.DELETE_PROP_ALERT_DICT.ERROR,
                details: e.message
            };
            props.showAlert(alertObj);
            console.debug(e);
        }
    }
    async function setReviewer(deliverable) {
        let activeUser = props.activeUser;
        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                            name: GLOBAL_VARS.SET_REVIEWER_ACTION,
                            authorization: [
                                {
                                    actor: activeUser.accountName,
                                    permission: activeUser.requestPermission
                                }
                            ],
                            data: {
                                proposal_id: id,
                                deliverable_id: 1,
                                // reviewer should be a state.
                                new_reviewer: reviewerAccountName
                            }
                        }
                    ]
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            let body = GLOBAL_ALERTS.SET_REVIEWER_ALERT_DICT.SUCCESS.body.slice(0);
            body = body.replace('%reviewer_name%', reviewerAccountName);
            body = body.replace('%proposal_id%', id);
            let alertObj = {
                ...GLOBAL_ALERTS.SET_REVIEWER_ALERT_DICT.SUCCESS,
                body: body
            };
            props.showAlert(alertObj);
            props.rerunProposalQuery();
        } catch (e) {
            let alertObj = {
                ...GLOBAL_ALERTS.SET_REVIEWER_ALERT_DICT.ERROR,
                details: e.message
            };
            props.showAlert(alertObj);
            console.debug(e);
        }
    }

    function renderOptions() {
        if (props.proposal.status === GLOBAL_VARS.DRAFTING_KEY) {
            return (
                <button
                    className="button button--text"
                    onClick={cancelProposal}
                >
                    Cancel proposal
                </button>
            );
        } else if (props.proposal.status === GLOBAL_VARS.SUBMITTED_KEY) {
            return (
                <div>
                    <div className="adminMenu__actions">
                        <button
                            className="button button--secondary"
                            onClick={() => toggleShowReviewerModal(true)}
                        >
                            {`${props.proposal.reviewer ? 'Update' : 'Set'}`} reviewer
                        </button>
                        <button
                            className="button button--approval"
                            disabled={!props.proposal.reviewer}
                            onClick={() => reviewProposal(true, true)}
                        >
                            Approve proposal
                        </button>
                        <button
                            className="button button--approvalNoIcon"
                            disabled={!props.proposal.reviewer}
                            onClick={() => skipVoting()}
                        >
                            Approve and skip voting
                        </button>
                    </div>
                    <div className="adminMenu__actions adminMenu__actions--row">
                        <button
                            className="button button--text"
                            onClick={cancelProposal}
                        >
                            Cancel proposal
                        </button>
                        <Accordion className="adminMenu__accordion">
                            <div className="adminMenu__accordionContent">
                                <Accordion.Button
                                    eventKey="1"
                                    as="div"
                                    className="adminMenu__toggle"
                                >
                                    <button className="button button--askchanges">
                                        Ask for changes
                                    </button>
                                </Accordion.Button>
                                <Accordion.Body eventKey="1">
                                    <div className="adminMenu__askchanges">
                                        <label className="input__label">
                                            Enter the required changes
                                        </label>
                                        <textarea
                                            className="textarea"
                                            value={rejectionReason}
                                            onChange={(e) => {
                                                setRejectionReason(e.target.value);
                                            }}
                                        />
                                        <button
                                            className="button button--secondary"
                                            onClick={() => reviewProposal(false, true)}
                                        >
                                            {' '}
                                            Submit review{' '}
                                        </button>
                                    </div>
                                </Accordion.Body>
                            </div>
                            <div className="adminMenu__accordionContent">
                                <Accordion.Button
                                    eventKey="0"
                                    as="div"
                                    className="adminMenu__toggle"
                                >
                                    <button className="button button--rejection">
                                        Reject proposal
                                    </button>
                                </Accordion.Button>
                                <Accordion.Body eventKey="0">
                                    <div className="adminMenu__reject">
                                        <label className="input__label">
                                            Enter the rejection reason
                                        </label>
                                        <textarea
                                            className="textarea"
                                            value={rejectionReason}
                                            onChange={(e) => {
                                                setRejectionReason(e.target.value);
                                            }}
                                        />
                                        <button
                                            className="button button--secondary"
                                            onClick={() => reviewProposal(false, false)}
                                        >
                                            {' '}
                                            Submit Review{' '}
                                        </button>
                                    </div>
                                </Accordion.Body>
                            </div>
                        </Accordion>
                    </div>
                </div>
            );
        } else if (
            [GLOBAL_VARS.APPROVED_KEY, GLOBAL_VARS.VOTING_KEY].includes(props.proposal.status)
        ) {
            return (
                <div className="adminMenu__actions">
                    <button
                        className="button button--text"
                        onClick={cancelProposal}
                    >
                        Cancel proposal
                    </button>
                    {props.proposal.status === GLOBAL_VARS.VOTING_KEY &&
                        props.votingEndsIn.includes('ago') && (
                            <button
                                className="button button--text"
                                onClick={endVoting}
                            >
                                End Voting
                            </button>
                        )}
                    <button
                        className="button button--secondary"
                        onClick={() => toggleShowReviewerModal(true)}
                    >
                        {`${props.proposal.reviewer ? 'Update' : 'Set'}`} reviewer
                    </button>
                </div>
            );
        } else if (props.proposal.status === GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY) {
            return (
                <button
                    className="button button--secondary"
                    onClick={() => toggleShowReviewerModal(true)}
                >
                    {`${props.proposal.reviewer ? 'Update' : 'Set'}`} reviewer
                </button>
            );
        } else if (
            [GLOBAL_VARS.CANCELLED_KEY, GLOBAL_VARS.FAILED_KEY, GLOBAL_VARS.COMPLETED_KEY].includes(
                props.proposal.status
            )
        ) {
            return (
                <button
                    className="button button--text"
                    onClick={deleteProposal}
                >
                    Delete Proposal
                </button>
            );
        }
        return '';
    }

    if (props.isAdmin) {
        return (
            <div className="adminMenu">
                <h3>Admin menu</h3>
                {renderOptions()}
                <Modal
                    className="customModal"
                    show={showReviewerModal}
                    centered="true"
                    onHide={() => toggleShowReviewerModal(false)}
                >
                    <Modal.Body className="customModal__body">
                        <div className="input__label">Set the reviewer account name</div>
                        <input
                            type="text"
                            name="reviewer"
                            value={reviewerAccountName}
                            maxLength="12"
                            onChange={handleReviewerChange}
                            className="input"
                        />
                        <button
                            className="button button--secondary adminMenu__modalAction"
                            onClick={setReviewer}
                        >
                            Set reviewer
                        </button>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
    return null;
}
