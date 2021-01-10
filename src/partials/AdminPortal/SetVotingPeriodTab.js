import React, {useState} from 'react';

import './SetVotingPeriod.css'
import * as GLOBAL_VARS from '../../utils/vars'
import * as GLOBAL_ALERTS from '../../utils/alerts';
import RenderLoadingPage from '../LoadingPage';


function calculateTime (seconds) {
    let timeObj = {days: 0, hours: 0, minutes: 0, seconds: 0};

    if(seconds <= 0)
    {
        return timeObj;
    }

    timeObj = {
        days: Math.floor(seconds / ( 60 * 60 * 24)),
        hours: Math.floor((seconds / (60 * 60)) % 24),
        minutes: Math.floor((seconds / (60)) % 60),
        seconds: Math.floor((seconds) % 60)
    }

    return timeObj;

}

function RenderTime(timeObj){
    return(
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
    )
}

export default function RenderSetVotingPeriodTab (props) {
    const [newVotingPeriod, setNewVotingPeriod] = useState(60);

    function createSetVotingPeriodAction(quantity) {
        let activeUser = props.activeUser
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.SET_VOTING_DURATION_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                new_vote_duration: parseInt(newVotingPeriod),
            }
        }
    }

    async function setVotingPeriod(){
        let activeUser = props.activeUser;
        let actionList = [createSetVotingPeriodAction()];

        try {
            await activeUser.signTransaction (
                {actions: actionList}
                , {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            props.showAlert(GLOBAL_ALERTS.SET_DURATION_ALERT_DICT.SUCCESS);
            props.rerunVotingPeriodQuery();
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.SET_DURATION_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }
    }

    return (
        <div>
            {
                props.queryingVotingPeriod ? 
                <RenderLoadingPage/>
                :
                <div>

                    <h2>Current voting period</h2>
                    {RenderTime(calculateTime(props.votingDuration))}                
                </div>
            }
            <div>
                <label>New voting period</label>
                <input value={newVotingPeriod} type="number" onChange={(e)=>setNewVotingPeriod(e.target.value)}></input>
            </div>
            <div>
                <h2>The new voting period will be</h2>
                {RenderTime(calculateTime(newVotingPeriod))}
                <button className="btn" onClick={()=>setVotingPeriod()}>Set voting period</button>
            
            </div>

        </div>
    );
}