import React, {useState, useEffect} from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';
import {requestedAmountToFloat, sleep} from '../../utils/util';

import RenderAlerts from '../Alerts/Alerts';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderBalance(props) {

    const [balance, setBalance] = useState(0);
    const [queryingBalance, setQueryingBalance] = useState(true);
    const [accountQueryCount, setAccountQueryCount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);

    const [alertList, setAlertList] = useState([]);

    function showAlert(alertObj){
        // Make a copy.
        let alerts = alertList.slice(0);
        // Push new alert to the copied list
        alerts.push(alertObj);
        // Update the list.
        setAlertList(alerts);
    }

    function removeAlert(index){
        // Make a copy.
        let alerts = alertList.slice(0);
        // remove alert at index.
        alerts.splice(index,1);
        // Update the list.
        setAlertList(alerts);
    }
    
    function createWithdrawAction(quantity) {
        let activeUser = props.activeUser
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.WITHDRAW_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                account_owner: activeUser.accountName,
                quantity: quantity.toFixed(8) + " WAX",
            }
        }
    }

    async function withdrawFunds() {
        let activeUser = props.activeUser;
        let actionList = [createWithdrawAction(parseFloat(withdrawAmount))];

        try {
            await activeUser.signTransaction (
                {actions: actionList}
                , {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            showAlert(GLOBAL_ALERTS.WITHDRAW_FUNDS_ALERT_DICT.SUCCESS);
            rerunAccountQuery();
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.WITHDRAW_FUNDS_ALERT_DICT.ERROR,
                details: e.message
            }
            showAlert(alertObj);
        }

    }
    async function rerunAccountQuery(){
        setQueryingBalance(true);
        await sleep(3000);
        setAccountQueryCount(accountQueryCount + 1);
    }
    useEffect(()=>{
        let cancelled = false;
        async function getAccountInfo() {
            setQueryingBalance(true);
            try {
                let resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    scope: props.activeUser.accountName,
                    table: GLOBAL_VARS.ACCOUNTS_TABLE,
                    json: true,
                    limit: 1
                });
                console.log(resp);
                if(!cancelled){
                    if(resp.rows.length) {
                        setBalance(requestedAmountToFloat(resp.rows[0].balance));                        
                    } else {
                        setBalance(0);
                    }
                    setQueryingBalance(false);
                }                
            } catch (e){
                console.log(e);
            }
        }
        if(props.activeUser){
            getAccountInfo();
        }

        const cleanup = () => { cancelled = true }
        return cleanup
    }, [props.activeUser, accountQueryCount]);

    return (
        <div style={{color:"white"}}>
            <RenderAlerts
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <div>
                Your balance is
                <h1>
                    { queryingBalance 
                    ?   
                        "Loading..."
                    :   balance + " WAX"}
                </h1>
            </div>
            <div>
                Withdraw balance
                <input
                    type="number" 
                    value={withdrawAmount}
                    onChange={
                        (e)=>{
                            setWithdrawAmount(e.target.value);
                        }
                    }
                />
                <button
                    className="btn"
                    onClick={()=>withdrawFunds()}
                >
                    Withdraw                
                </button>
            </div>
            
        </div>
    );
}