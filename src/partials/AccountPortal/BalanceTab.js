import React, {useState, useEffect} from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';
import {requestedAmountToFloat, sleep} from '../../utils/util';

import './BalanceTab.scss';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderBalanceTab(props) {

    const [balance, setBalance] = useState(0);
    const [queryingBalance, setQueryingBalance] = useState(true);
    const [accountQueryCount, setAccountQueryCount] = useState(0);

    const [withdrawAmount, setWithdrawAmount] = useState("");
    // const [donateAmount, setDonateAmount] = useState("");

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
                quantity: quantity.toFixed(8) + " " +  GLOBAL_VARS.TOKEN_SYMBOL,
            }
        }
    }

    // function createDonateAction(quantity) {
    //     let activeUser = props.activeUser;
    //     return {
    //         account: GLOBAL_VARS.EOSIO_TOKEN_CODE,
    //         name: GLOBAL_VARS.TRANSFER_ACTION,
    //         authorization: [{
    //             actor: activeUser.accountName,
    //             permission: activeUser.requestPermission,
    //         }],
    //         data: {
    //             from: activeUser.accountName,
    //             to: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
    //             quantity: quantity.toFixed(8) + " " +  GLOBAL_VARS.TOKEN_SYMBOL ,
    //             memo: GLOBAL_VARS.DEPOSIT_MEMO,
    //         }
    //     }
    // }

    // async function donateFunds(){
    //     let activeUser = props.activeUser;
    //     let actionList = [createDonateAction(parseFloat(donateAmount))];

    //     try {
    //         await activeUser.signTransaction (
    //             {actions: actionList}
    //             , {
    //                 blocksBehind: 3,
    //                 expireSeconds: 30,
    //             }
    //         );
    //         props.showAlert(GLOBAL_ALERTS.DONATE_FUNDS_ALERT_DICT.SUCCESS);
    //         rerunAccountQuery();
    //     } catch(e){
    //         console.log(e);
    //         let alertObj = {
    //             ...GLOBAL_ALERTS.DONATE_FUNDS_ALERT_DICT.ERROR,
    //             details: e.message
    //         }
    //         props.showAlert(alertObj);
    //     }
    // }

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
            props.showAlert(GLOBAL_ALERTS.WITHDRAW_FUNDS_ALERT_DICT.SUCCESS);
            rerunAccountQuery();
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.WITHDRAW_FUNDS_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
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
        <div className="balanceTab">
            <div className="balanceTab__balanceInformation">
                <p>Your balance in the labs smart contract is</p>
                <h1>
                    { queryingBalance
                    ?
                        "Loading..."
                    :   balance + " WAX"}
                </h1>
            </div>
            <div className="balanceTab__withdraw">
                <h4>Withdraw from your balance</h4>
                <div className="balanceTab__withdrawForm">
                    <div>
                        <label className="input__label">Withdrawal amount</label>
                        <input
                            type="number"
                            value={withdrawAmount}
                            onChange={
                                (e)=>{
                                    setWithdrawAmount(e.target.value);
                                }
                            }
                            className="input"
                        />
                    </div>
                    <button
                        className="button button--secondary"
                        onClick={()=>withdrawFunds()}
                    >
                        Withdraw
                    </button>
                </div>
            </div>         

        </div>
    );
}