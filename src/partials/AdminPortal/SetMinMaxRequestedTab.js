import React, {useState, useEffect} from 'react';


import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';

import SimpleReactValidator from 'simple-react-validator';


import RenderLoadingPage from '../LoadingPage';

import './SetMinMaxRequestedTab.scss';
import { requestedAmountToFloat, numberWithCommas } from '../../utils/util';
import { calculateWAXPrice, calculateUSDPrice } from '../../utils/delphioracle';
import SwitchArrow from '../../icons/SwitchArrow';

const validator = new SimpleReactValidator();

export default function RenderSetMinMaxRequestedTab(props) {

    const [newMinRequested, setNewMinRequested] = useState("");
    const [newMaxRequested, setNewMaxRequested] = useState("");
    const [minPriceUsd, setMinPriceUsd] = useState(true);
    const [maxPriceUsd, setMaxPriceUsd] = useState(true);
    const [minWaxPrice, setMinWaxPrice] = useState("");
    const [maxWaxPrice, setMaxWaxPrice] = useState("");

    useEffect(() => {
        props.loadWaxUsdPrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const minRequestedErrorMessage = validator.message('new minimum usd requested', newMinRequested, `min:0.0001,num|max:${requestedAmountToFloat(props.maxRequested) - 0.0001},num`);
    const maxRequestedErrorMessage = validator.message('new maximum usd requested', newMaxRequested, `min:${requestedAmountToFloat(props.minRequested) - 0.0001},num`);

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
        setNewMinRequested("");
        setMinWaxPrice("");
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
            setNewMaxRequested("");
            setMaxWaxPrice("");
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
            {props.queryingMinMaxRequested || !props.waxUsdPrice ? (
                <RenderLoadingPage />
            ) : (
                <>
                <div className="setMinMaxRequested__section">
                    <h4>Current minimum requested value</h4>
                        <p>
                        {numberWithCommas(requestedAmountToFloat(props.minRequested)).toString()  + " " + props.minRequested.split(" ")[1]}
                        {"  "}
                        {
                            props.minRequested.split(" ")[1] === "USD" ?
                                `(${numberWithCommas(calculateWAXPrice(requestedAmountToFloat(props.minRequested), props.waxUsdPrice)).toString()} WAX)`
                                : `(${numberWithCommas(calculateUSDPrice(requestedAmountToFloat(props.minRequested), props.waxUsdPrice)).toString()} USD)`
                            
                        }   
                        </p>
                    <h4>Current maximum requested value</h4>
                        <p>
                            {numberWithCommas(requestedAmountToFloat(props.maxRequested)).toString() + " " + props.maxRequested.split(" ")[1]}
                            {"  "}
                            {
                                props.maxRequested.split(" ")[1] === "USD" ?
                                    `(${numberWithCommas(calculateWAXPrice(requestedAmountToFloat(props.maxRequested), props.waxUsdPrice)).toString()} WAX)`
                                    : `(${numberWithCommas(calculateUSDPrice(requestedAmountToFloat(props.maxRequested), props.waxUsdPrice)).toString()} USD)`
                                
                            }
                        </p>
                </div>
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
                                type="text"
                                name="min-requested"
                                pattern="^[0-9]*\.?[0-9]{0,2}$"
                                value={newMinRequested ? newMinRequested : ""}
                                onChange={(e) => {
                                    if (e.target.validity.valid || !e.target.value) {
                                        setNewMinRequested(e.target.value);
                                        setMinWaxPrice(requestedAmountToFloat(calculateWAXPrice(e.target.value, props.waxUsdPrice)));
                                        validator.fieldValid("new minimum requested");
                                    }
                                }}
                            />
                        </div>
                        <div className="input__errorMessage">
                            {minRequestedErrorMessage}
                        </div>  
                        <button className="button swap_currency button--primary" onClick={() => {
                            setMinPriceUsd(!minPriceUsd);
                            if (!(minWaxPrice > 0) || isNaN(minWaxPrice)) setMinWaxPrice("");
                            if (!(newMinRequested > 0) || isNaN(newMinRequested)) setNewMinRequested("");
                        }
                        }> <SwitchArrow /> </button>
                        <div className="setMinMaxRequested_fieldset">
                            <label className="input__label">New minimum requested WAX</label>
                            <input
                                className={`${
                                minRequestedErrorMessage ? 'input input--error' : 'input'
                                }`}
                                type="text"
                                name="min-requested"
                                pattern="^[0-9]*\.?[0-9]{0,2}$"
                                disabled={true}
                                placeholder={Number(minWaxPrice) > 0 ? minWaxPrice : ""}
                                onChange={(e) => {
                                    if (e.target.validity.valid || !e.target.value) {
                                        setNewMinRequested(requestedAmountToFloat(calculateUSDPrice(e.target.value, props.waxUsdPrice)));
                                        setMinWaxPrice(e.target.value);
                                        validator.fieldValid("new minimum requested");
                                    }
                                }}
                            />
                        </div>  
                    </>    
                    : <>
                        <div className="setMinMaxRequested_fieldset">
                            <label className="input__label">New minimum requested WAX</label>
                            <input
                                className={`${
                                minRequestedErrorMessage ? 'input input--error' : 'input'
                                }`}
                                type="text"
                                name="min-requested"
                                pattern="^[0-9]*\.?[0-9]{0,2}$"
                                value={minWaxPrice}
                                onChange={(e) => {
                                    if (e.target.validity.valid || !e.target.value) {
                                        setNewMinRequested(requestedAmountToFloat(calculateUSDPrice(e.target.value, props.waxUsdPrice)));
                                        setMinWaxPrice(e.target.value);
                                        validator.fieldValid("new minimum requested");
                                    }
                                }}
                            />
                        </div>
                        <button className="button swap_currency button--primary" onClick={() => {
                            setMinPriceUsd(!minPriceUsd);
                            if (!(minWaxPrice > 0) || isNaN(minWaxPrice)) setMinWaxPrice("");
                            if (!(newMinRequested > 0) || isNaN(newMinRequested)) setNewMinRequested("");
                        }
                        }> <SwitchArrow /> </button>
                        <div className="setMinMaxRequested_fieldset">
                            <label className="input__label">New minimum requested USD</label>
                            <input
                                className={`${
                                minRequestedErrorMessage ? 'input input--error' : 'input'
                                }`}
                                type="text"
                                name="min-requested"
                                pattern="^[0-9]*\.?[0-9]{0,2}$"
                                disabled={true}
                                placeholder={Number(newMinRequested) > 0 ? newMinRequested : ""}
                                onChange={(e) => {
                                    if (e.target.validity.valid || !e.target.value) {
                                        setMinWaxPrice(requestedAmountToFloat(calculateWAXPrice(e.target.value, props.waxUsdPrice)));
                                        setMinWaxPrice("");
                                        validator.fieldValid("new minimum requested");
                                    }
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
                                type="text"
                                name="max-requested"
                                pattern="^[0-9]*\.?[0-9]{0,2}$"
                                disabled={maxPriceUsd ? false : true}
                                value={newMaxRequested ? newMaxRequested : ""}
                                onChange={(e) => {
                                    if (e.target.validity.valid || !e.target.value) {
                                        setNewMaxRequested(e.target.value);
                                        setMaxWaxPrice(requestedAmountToFloat(calculateWAXPrice(e.target.value, props.waxUsdPrice)));
                                        validator.fieldValid("new maximum requested");
                                    }
                                }}
                            />
                        </div>
                        <div className="input__errorMessage">
                            {maxRequestedErrorMessage}
                        </div> 
                        <button className="button--primary button swap_currency" onClick={() => {
                            setMaxPriceUsd(!maxPriceUsd);
                            if (!(maxWaxPrice > 0) || isNaN(maxWaxPrice)) setMaxWaxPrice("");
                            if (!(newMaxRequested > 0) || isNaN(newMaxRequested)) setNewMaxRequested("");
                        }
                        }> <SwitchArrow /> </button>
                        <div className="setMinMaxRequested_fieldset">
                            <label className="input__label">New maximum requested WAX</label>
                            <input
                                className={`${
                                maxRequestedErrorMessage ? 'input input--error' : 'input'
                                }`}
                                type="text"
                                name="max-requested"
                                pattern="^[0-9]*\.?[0-9]{0,2}$"
                                disabled={maxPriceUsd ? true : false}
                                value={maxWaxPrice}
                                onChange={(e) => {
                                    if (e.target.validity.valid || !e.target.value) {
                                        setMaxWaxPrice(e.target.value);
                                        setNewMaxRequested(requestedAmountToFloat(calculateUSDPrice(e.target.value, props.waxUsdPrice)));
                                        validator.fieldValid("new maximum requested");
                                    }
                                }}
                            />
                        </div>   
                    </>    
                    : <>
                        <div className="setMinMaxRequested_fieldset">
                            <label className="input__label">New maximum requested WAX</label>
                            <input
                                className={`${
                                maxRequestedErrorMessage ? 'input input--error' : 'input'
                                }`}
                                type="text"
                                name="max-requested"
                                pattern="^[0-9]*\.?[0-9]{0,2}$"
                                disabled={maxPriceUsd ? true : false}
                                value={maxWaxPrice}
                                onChange={(e) => {
                                    if (e.target.validity.valid || !e.target.value) {
                                        setMaxWaxPrice(e.target.value);
                                        setNewMaxRequested(requestedAmountToFloat(calculateUSDPrice(e.target.value, props.waxUsdPrice)));
                                        validator.fieldValid("new maximum requested");
                                    }
                                }}
                            />
                        </div>
                        <button className="button swap_currency button--primary" onClick={() => {
                            setMaxPriceUsd(!maxPriceUsd);
                            if (!(maxWaxPrice > 0) || isNaN(maxWaxPrice)) setMaxWaxPrice("");
                            if (!(newMaxRequested > 0) || isNaN(newMaxRequested)) setNewMaxRequested("");
                        }
                        }> <SwitchArrow /> </button>
                            <div className="setMinMaxRequested_fieldset">
                            <label className="input__label">New maximum requested USD</label>
                            <input
                                className={`${
                                maxRequestedErrorMessage ? 'input input--error' : 'input'
                                }`}
                                type="text"
                                name="max-requested"
                                pattern="^[0-9]*\.?[0-9]{0,2}$"
                                disabled={maxPriceUsd ? false : true}
                                value={newMaxRequested ? newMaxRequested : ""}
                                onChange={(e) => {
                                    if (e.target.validity.valid || !e.target.value) {
                                        setNewMaxRequested(e.target.value);
                                        setMaxWaxPrice(requestedAmountToFloat(calculateWAXPrice(e.target.value, props.waxUsdPrice)));
                                        validator.fieldValid("new maximum requested");
                                    }
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
                </>
            )}
            
        </div>
    );
}