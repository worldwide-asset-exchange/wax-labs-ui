import React, {useState} from 'react';
import RenderProposalInputContainer from '../EditPage/ProposalInputContainer';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';

import RenderAlerts from '../Alerts/Alerts';

export default function RenderCreateProposalPage(props){
    const [allValid, setAllValid] = useState(true);
    const [proposal, setProposal] = useState(null);
    const [showValidatorMessages, setShowValidatorMessages] = useState(0);
    const [alertList, setAlertList] = useState([]);
    const [transactionId, setTransactionId] = useState(null);

    function updateProposal(proposal){
        setProposal(proposal);
    }
    function updateAllValid(allValid){
        setAllValid(allValid);
    }
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

    async function createProposal(){
        let activeUser = props.activeUser;
        if(!allValid){
            showAlert(GLOBAL_ALERTS.INVALID_DATA_ALERT_DICT.WARN);
            setShowValidatorMessages(showValidatorMessages + 1);
            return
        }
        try {
            let resp = await activeUser.signTransaction({
                actions: [
                    {
                        account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                        name: GLOBAL_VARS.DRAFT_PROPOSAL_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            proposer: activeUser.accountName,
                            category: proposal.category,
                            title: proposal.title,
                            description: proposal.description,
                            image_url: proposal.image_url,
                            estimated_time: proposal.estimated_time,
                            mdbody: proposal.content,
                            total_requested_funds: Number(1000).toFixed(8) + " WAX",
                            deliverables_count: proposal.deliverables,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
            let alertObj = {
                ...GLOBAL_ALERTS.DRAFT_PROP_ALERT_DICT.SUCCESS
            }
            setTransactionId(resp.transaction.transaction_id);
            showAlert(alertObj);
        } catch(e) {
            let alertObj = {
                ...GLOBAL_ALERTS.DRAFT_PROP_ALERT_DICT.ERROR,
                details: e.message
            }
            showAlert(alertObj);
            console.log(e);
        }
    }

    if(!props.activeUser){
        return (
            <div>
                Login to create a proposal.
            </div>
        )
    }

    if(transactionId){
        return (
            <div>
                <div>
                    Proposal created successfully
                </div>
                Transaction link:
                <a href={`https://wax${props.activeUser.chainId === GLOBAL_VARS.TESTNET_CHAIN_ID ? "-test" : ""}.bloks.io/transaction/${transactionId}`}>{transactionId.slice(0,8)}</a>
            </div>
        )
    }

    return (
        <div className="create-proposal">
            <RenderAlerts 
                alertList={alertList}
                removeAlert={removeAlert}
            />
            <RenderProposalInputContainer
                hideTotalRequested={true} 
                categories={props.categories}
                //Necessary to be >= 1000 so validator won't say it is invalid
                totalRequestedFunds={GLOBAL_VARS.PROPOSAL_MIN_REQUESTED}
                updateEditableProposal={updateProposal}
                activeUser={props.activeUser}
                showValidatorMessages={showValidatorMessages}
                updateValidatorData={updateAllValid}
            />
            <button className='btn' onClick={createProposal}>Create Proposal</button>
        </div>
        
    )
}