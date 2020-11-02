import React, {useState, useEffect} from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderInReviewProposals(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [account_balance, setBalance] = useState('0.00000000 WAX');
    const [donation, setDonationAmount] = useState('0.00000000');
    const activeUser = props.activeUser;

    useEffect(() => {
        async function getAccountBalance() {
        try {
            if (props.activeUser.accountName) {
            let resp = await wax.rpc.get_table_rows({             
                  code: 'labs',
                  scope: props.activeUser.accountName,
                  table: 'accounts',
                  json: true
              });
              if (!resp.rows.length) {
                return null;
            } else {
                console.log(resp.rows[0].balance);
                setBalance(resp.rows[0].balance);
            }
            } else {
                return null;
            }
            
            } catch(e) {
              console.log(e);
            }
        }
        getAccountBalance();
        }, []);

        function handleInputChange(event) {
            const value = event.target.value;
    
            setDonationAmount(prevState => {
                return { ...prevState, donation_amount: value }
              }
            );
        }        

        async function donateWAX(){
            try {
                await activeUser.signTransaction({
                    actions: [
                        {
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: activeUser.accountName,
                                permission: 'active',
                            }],
                            data: {
                                from: activeUser.accountName,
                                to: 'labs',
                                quantity: donation.donation_amount + 'WAX',
                                memo: 'fund'
                            },
                        },
                    ]} , {
                    blocksBehind: 3,
                    expireSeconds: 30
                });
            } catch(e) {
                console.log(e);
            }
        }

        return (
            <div className="account-info">
                <div className="account-info-table">
                    <div className="row">
                        <Link className="header-edit-button" to="edit">Edit</Link>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Name:</strong>
                        </div>
                        <div className="col value">
                            {props.full_name}
                            <Link to="edit">Edit</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Biography:</strong>
                        </div>
                        <div className="col value">
                            {props.bio}
                            <Link to="edit">Edit</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Image (url):</strong>
                        </div>
                        <div className="col value">
                            <img src={props.image_url} alt="" />
                            <Link to="edit">Edit</Link>
                        </div>        
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Country:</strong>    
                        </div>
                        <div className="col value">
                            {props.country}
                            <Link to="edit">Edit</Link>            
                        </div>                          
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Website:</strong>   
                        </div>
                        <div className="col value">
                            {props.website}
                            <Link to="edit">Edit</Link>                
                        </div>                         
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Telegram Handle:</strong>   
                        </div>
                        <div className="col value">
                            {props.contact}
                            <Link to="edit">Edit</Link>                
                        </div>                         
                    </div>
                </div>
                <div className="account-balance-panel">
                    <h3>WAX Labs Account Balance</h3>
                    <p>{account_balance}</p>
                    <p>Your WAX Labs account balance represents how many tokens you have deposited for proposal creation. In most cases, this amount should be 0 because the proposal creation transaction deducts the required amount of required resources from your account automatically</p>

                    <h3>Donate to WAX Labs</h3>
                    <p>Generous community members can give back by donating to the WAX Labs fund.</p>
                    <div className="donate-input">
                        <input type="text" name="donation_amount" onChange={handleInputChange} />
                        <button className="btn" onClick={donateWAX}>Donate</button>
                    </div>
                </div>
                
            </div>
        );
}