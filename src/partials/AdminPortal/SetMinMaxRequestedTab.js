import React, {useState, useEffect} from 'react';


import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';

import SimpleReactValidator from 'simple-react-validator';


import RenderLoadingPage from '../LoadingPage';

import './SetMinMaxRequestedTab.scss';
import { requestedAmountToFloat } from '../../utils/util';
import { calculateWAXPrice, calculateUSDPrice } from '../../utils/delphioracle';

const validator = new SimpleReactValidator();

export default function RenderSetMinMaxRequestedTab(props) {

    const [newMinRequested, setNewMinRequested] = useState("");
    const [newMaxRequested, setNewMaxRequested] = useState("");
    const [minPriceUsd, setMinPriceUsd] = useState(true);
    const [maxPriceUsd, setMaxPriceUsd] = useState(true);
    const [minWaxPrice, setMinWaxPrice] = useState("");
    const [maxWaxPrice, setMaxWaxPrice] = useState("");



    const minRequestedErrorMessage = validator.message('new minimum requested', newMinRequested, `min:0.0001,num|max:${requestedAmountToFloat(props.maxRequested) - 0.0001},num`);
    const maxRequestedErrorMessage = validator.message('new maximum requested', newMaxRequested, `min:${requestedAmountToFloat(props.minRequested) - 0.0001},num`);

    useEffect(()=>{
        if(props.showValidatorMessages){
            validator.showMessages();
        }
        else{
            validator.hideMessages();
        }
        // eslint-disable-next-line
    }, [props.showValidatorMessages]);
    
    function createSetMinRequestedAction(min_requested) {
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.SET_MIN_REQUESTED_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                new_min_requested : Number(min_requested).toFixed(4) + " USD",
            }
        }
    }
    function createSetMaxRequestedAction(max_requested) {   
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.SET_MAX_REQUESTED_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                new_max_requested: Number(max_requested).toFixed(4) + " USD",
            }
        }
    }

    async function setMinRequested() {
        if(!validator.fieldValid("new minimum requested") || !newMinRequested){
            props.showAlert(GLOBAL_ALERTS.INVALID_DATA_ALERT_DICT.WARN);
            props.setShowValidatorMessages(props.showValidatorMessages + 1);
            return;
        }

        let activeUser = props.activeUser;
        let actionList = [createSetMinRequestedAction(newMinRequested)];

        
        try {
        await activeUser.signTransaction (
            {actions: actionList}
            , {
                blocksBehind: 3,
                expireSeconds: 30,
            }
        );
        props.showAlert(GLOBAL_ALERTS.SET_MIN_REQUESTED_ALERT_DICT.SUCCESS);
        props.rerunSetMinMaxRequestedQuery();
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.SET_MIN_REQUESTED_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }
       
    }
    async function setMaxRequested() {
        if(!validator.fieldValid("new maximum requested") || !newMaxRequested){
            props.showAlert(GLOBAL_ALERTS.INVALID_DATA_ALERT_DICT.WARN);
            props.setShowValidatorMessages(props.showValidatorMessages + 1);
            return;
        }
        
        let activeUser = props.activeUser;
        let actionList = [createSetMaxRequestedAction(newMaxRequested)];

        try {
            await activeUser.signTransaction (
                {actions: actionList}
                , {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            props.showAlert(GLOBAL_ALERTS.SET_MAX_REQUESTED_ALERT_DICT.SUCCESS);
            props.rerunSetMinMaxRequestedQuery();
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.SET_MAX_REQUESTED_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }
    }

    return (
    <div className="setMinMaxRequested">
            {props.queryingMinMaxRequested ? (
                <RenderLoadingPage />
            ) : (
                <div className="setMinMaxRequested__section">
                    <h4>Current minimum requested value</h4>
                        {props.minRequested}
                    <h4>Current maximum requested value</h4>
                        {props.maxRequested}
                </div>
            )}
            <div className="setMinMaxRequested__section">
                <h4>Set new min requested</h4>
                {minPriceUsd ?
                <>
                    <div className="setMinMaxRequested_fieldset">
                        <label className="input__label">New minimum requested USD</label>
                        <input
                            className={`${
                            minRequestedErrorMessage ? 'input input--error' : 'input'
                            }`}
                            type="number"
                            name="min-requested"
                            min="0"
                            disabled={minPriceUsd ? false : true}
                            value={newMinRequested}
                            onChange={(e) => {
                                setNewMinRequested(e.target.value);
                                if (e.target.value > 0) {
                                    setMinWaxPrice(requestedAmountToFloat(calculateWAXPrice(e.target.value, props.waxusdprice)).toFixed(2));
                                } else {
                                    setMinWaxPrice("");
                                }
                                validator.fieldValid("new minimum requested");
                            }}
                        />
                    </div>
                    <button onClick={() => {
                        setMinPriceUsd(!minPriceUsd);
                        if (!(minWaxPrice > 0) || isNaN(minWaxPrice)) setMinWaxPrice("");
                        if (!(newMinRequested > 0) || isNaN(newMinRequested)) setNewMinRequested("");
                    }
                    }> Change currency </button>
                    <div className="setMinMaxRequested_fieldset">
                        <label className="input__label">New minimum requested WAX</label>
                        <input
                            className={`${
                            minRequestedErrorMessage ? 'input input--error' : 'input'
                            }`}
                            type="number"
                            name="min-requested"
                            min="0"
                            disabled={minPriceUsd ? true : false}
                            value={minWaxPrice}
                                onChange={(e) => {
                                if (e.target.value > 0) {
                                    setNewMinRequested(requestedAmountToFloat(calculateUSDPrice(e.target.value, props.waxusdprice)).toFixed(2));
                                } else {
                                    setNewMinRequested("");
                                }
                                setMinWaxPrice(e.target.value);
                                validator.fieldValid("new minimum requested");
                            }}
                        />
                    </div>
                    <div className="input__errorMessage">
                        {minRequestedErrorMessage}
                    </div>    
                </>    
                : <>
                    <div className="setMinMaxRequested_fieldset">
                        <label className="input__label">New minimum requested WAX</label>
                        <input
                            className={`${
                            minRequestedErrorMessage ? 'input input--error' : 'input'
                            }`}
                            type="number"
                            name="min-requested"
                            min="0"
                            disabled={minPriceUsd ? true : false}
                            value={minWaxPrice}
                            onChange={(e) => {
                                if (e.target.value > 0) {
                                    setNewMinRequested(requestedAmountToFloat(calculateUSDPrice(e.target.value, props.waxusdprice)).toFixed(2));
                                } else {
                                    setNewMinRequested("");
                                }
                                setMinWaxPrice(e.target.value);
                                validator.fieldValid("new minimum requested");
                            }}
                        />
                    </div>
                    <button onClick={() => {
                        setMinPriceUsd(!minPriceUsd);
                        if (!(minWaxPrice > 0) || isNaN(minWaxPrice)) setMinWaxPrice("");
                        if (!(newMinRequested > 0) || isNaN(newMinRequested)) setNewMinRequested("");
                    }
                    }> Change currency </button>
                    <div className="setMinMaxRequested_fieldset">
                        <label className="input__label">New minimum requested USD</label>
                        <input
                            className={`${
                            minRequestedErrorMessage ? 'input input--error' : 'input'
                            }`}
                            type="number"
                            name="min-requested"
                            min="0"
                            disabled={minPriceUsd ? false : true}
                            value={newMinRequested}
                            onChange={(e) => {
                                setNewMinRequested(e.target.value);
                                if (e.target.value > 0) {
                                    setMinWaxPrice(requestedAmountToFloat(calculateWAXPrice(e.target.value, props.waxusdprice)).toFixed(2));
                                } else {
                                    setMinWaxPrice("");
                                }
                                validator.fieldValid("new minimum requested");
                            }}
                        />
                    </div>
                    <div className="input__errorMessage">
                        {minRequestedErrorMessage}
                    </div>    
                </>
                }
                <button className="button button--primary" onClick={()=>setMinRequested()}>Set new minimum</button>
                <h4>Set new max requested</h4>
                {maxPriceUsd ?
                <>
                    <div className="setMinMaxRequested_fieldset">
                        <label className="input__label">New maximum requested USD</label>
                        <input
                            className={`${
                            maxRequestedErrorMessage ? 'input input--error' : 'input'
                            }`}
                            type="number"
                            name="max-requested"
                            min="0"
                            disabled={maxPriceUsd ? false : true}
                            value={newMaxRequested}
                            onChange={(e) => {
                                setNewMaxRequested(e.target.value);
                                if (e.target.value > 0) {
                                    setMaxWaxPrice(requestedAmountToFloat(calculateWAXPrice(e.target.value, props.waxusdprice)).toFixed(2));
                                } else {
                                    setMaxWaxPrice("");
                                }
                                validator.fieldValid("new maximum requested");
                            }}
                        />
                    </div>
                     <button onClick={() => {
                        setMaxPriceUsd(!maxPriceUsd);
                        if (!(maxWaxPrice > 0) || isNaN(maxWaxPrice)) setMaxWaxPrice("");
                        if (!(newMaxRequested > 0) || isNaN(newMaxRequested)) setNewMaxRequested("");
                    }
                    }> Change currency </button>
                    <div className="setMinMaxRequested_fieldset">
                        <label className="input__label">New maximum requested WAX</label>
                        <input
                            className={`${
                            maxRequestedErrorMessage ? 'input input--error' : 'input'
                            }`}
                            type="number"
                            name="max-requested"
                            min="0"
                            disabled={maxPriceUsd ? true : false}
                            value={maxWaxPrice}
                            onChange={(e) => {
                                setMaxWaxPrice(e.target.value);
                                if (e.target.value > 0) {
                                    setNewMaxRequested(requestedAmountToFloat(calculateUSDPrice(e.target.value, props.waxusdprice)).toFixed(2));
                                } else {
                                    setNewMaxRequested("");
                                }
                                validator.fieldValid("new maximum requested");
                            }}
                        />
                    </div>
                    <div className="input__errorMessage">
                        {minRequestedErrorMessage}
                    </div>    
                </>    
                : <>
                    <div className="setMinMaxRequested_fieldset">
                        <label className="input__label">New maximum requested WAX</label>
                        <input
                            className={`${
                            maxRequestedErrorMessage ? 'input input--error' : 'input'
                            }`}
                            type="number"
                            name="max-requested"
                            min="0"
                            disabled={maxPriceUsd ? true : false}
                            value={maxWaxPrice}
                            onChange={(e) => {
                                setMaxWaxPrice(e.target.value);
                                if (e.target.value > 0) {
                                    setNewMaxRequested(requestedAmountToFloat(calculateUSDPrice(e.target.value, props.waxusdprice)).toFixed(2));
                                } else {
                                    setNewMaxRequested("");
                                }
                                validator.fieldValid("new maximum requested");
                            }}
                        />
                    </div>
                    <button onClick={() => {
                        setMaxPriceUsd(!maxPriceUsd);
                        if (!(maxWaxPrice > 0) || isNaN(maxWaxPrice)) setMaxWaxPrice("");
                        if (!(newMaxRequested > 0) || isNaN(newMaxRequested)) setNewMaxRequested("");
                    }
                    }> Change currency </button>
                        <div className="setMinMaxRequested_fieldset">
                        <label className="input__label">New maximum requested USD</label>
                        <input
                            className={`${
                            maxRequestedErrorMessage ? 'input input--error' : 'input'
                            }`}
                            type="number"
                            name="max-requested"
                            min="0"
                            disabled={maxPriceUsd ? false : true}
                            value={newMaxRequested}
                            onChange={(e) => {
                                setNewMaxRequested(e.target.value);
                                if (e.target.value > 0) {
                                    setMaxWaxPrice(requestedAmountToFloat(calculateWAXPrice(e.target.value, props.waxusdprice)).toFixed(2));
                                } else {
                                    setMaxWaxPrice("");
                                }
                                validator.fieldValid("new maximum requested");
                            }}
                        />
                    </div>
                    <div className="input__errorMessage">
                        {maxRequestedErrorMessage}
                    </div>    
                </>
                }
                <button className="button button--primary" onClick={()=>setMaxRequested()}>Set new maximum</button>
            </div>
        </div>
    );
}