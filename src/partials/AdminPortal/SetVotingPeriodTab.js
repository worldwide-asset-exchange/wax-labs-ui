import { useState, useEffect } from 'react';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';
import { calculateTime } from '../../utils/util';
import RenderLoadingPage from '../LoadingPage';

import './SetVotingPeriodTab.scss';

function RenderTime(timeObj) {
    return (
        <div className="block-buy-timeleft">
            <div className="timeleft-unit">
                <div>{`${timeObj.days}`}</div>
                <span>days</span>
            </div>
            <div className="timeleft-unit">
                <div>{`${timeObj.hours}`}</div>
                <span>hours</span>
            </div>
            <div className="timeleft-unit">
                <div>{`${timeObj.minutes}`}</div>
                <span>minutes</span>
            </div>
            <div className="timeleft-unit timeleft-unit--no-border">
                <div>{`${timeObj.seconds}`}</div>
                <span>seconds</span>
            </div>
        </div>
    );
}

export default function RenderSetVotingPeriodTab(props) {
    const [newVotingPeriod, setNewVotingPeriod] = useState(60);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setNewVotingPeriod(days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds);
    }, [days, hours, minutes, seconds]);

    function createSetVotingPeriodAction(quantity) {
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.SET_VOTING_DURATION_ACTION,
            authorization: [
                {
                    actor: activeUser.accountName,
                    permission: activeUser.requestPermission
                }
            ],
            data: {
                new_vote_duration: parseInt(newVotingPeriod)
            }
        };
    }

    async function setVotingPeriod() {
        let activeUser = props.activeUser;
        let actionList = [createSetVotingPeriodAction()];

        try {
            await activeUser.signTransaction(
                { actions: actionList },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            props.showAlert(GLOBAL_ALERTS.SET_DURATION_ALERT_DICT.SUCCESS);
            props.rerunVotingPeriodQuery();
        } catch (e) {
            console.debug(e);
            let alertObj = {
                ...GLOBAL_ALERTS.SET_DURATION_ALERT_DICT.ERROR,
                details: e.message
            };
            props.showAlert(alertObj);
        }
    }

    return (
        <div className="setVotingPeriod">
            {props.queryingVotingPeriod ? (
                <RenderLoadingPage />
            ) : (
                <div className="setVotingPeriod__section">
                    <h4>Current voting period</h4>
                    {RenderTime(calculateTime(props.votingDuration))}
                </div>
            )}
            <div className="setVotingPeriod__section">
                <h4>Set new voting period</h4>
                <div className="setVotingPeriod__periodForm">
                    <div className="setVotingPeriod__fieldset">
                        <label className="input__label">Days</label>
                        <input
                            value={days}
                            type="number"
                            onChange={(e) => setDays(Math.max(e.target.value, 0))}
                            className="input"
                        />
                    </div>
                    <div className="setVotingPeriod__fieldset">
                        <label className="input__label">Hours</label>
                        <input
                            value={hours}
                            type="number"
                            onChange={(e) => setHours(Math.max(Math.min(e.target.value, 23), 0))}
                            className="input"
                        />
                    </div>
                    <div className="setVotingPeriod__fieldset">
                        <label className="input__label">Minutes</label>
                        <input
                            value={minutes}
                            type="number"
                            onChange={(e) => setMinutes(Math.max(Math.min(e.target.value, 59), 0))}
                            className="input"
                        />
                    </div>
                    <div className="setVotingPeriod__fieldset">
                        <label className="input__label">Seconds</label>
                        <input
                            value={seconds}
                            type="number"
                            onChange={(e) => setSeconds(Math.max(Math.min(e.target.value, 59), 0))}
                            className="input"
                        />
                    </div>
                </div>
                <p>The new voting period will be</p>
                {RenderTime(calculateTime(newVotingPeriod))}
                <button
                    className="button button--primary"
                    onClick={() => setVotingPeriod()}
                >
                    Set voting period
                </button>
            </div>
        </div>
    );
}
