import React, {useState, useEffect} from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderInReviewProposals(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [donation, setDonationAmount] = useState('0');
    const activeUser = props.activeUser;

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
                            quantity: donation.donation_amount + '.00000000 WAX',
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
            <h2>Hello, {props.wax_account}</h2>
            <div className="account-menu">
                <ul>
                    <li><Link className="btn" to="/proposals/my-proposals">My Proposals</Link></li>
                    <li><Link className="btn" to="edit">Edit Profile</Link></li>
                </ul>
            </div>
            <div className="profile-picture">
                <img src={props.image_url} alt="" />     
            </div>
            <div className="account-info-table">
                <div className="row">
                    <div className="label">
                        <strong>Name:</strong>
                    </div>
                    <div className="value">
                        {props.full_name}
                    </div>
                </div>
                <div className="row">
                    <div className="label">
                        <strong>Biography:</strong>
                    </div>
                    <div className="value">
                        {props.bio}
                    </div>
                </div>
                <div className="row">
                    <div className="label">
                        <strong>Country:</strong>    
                    </div>
                    <div className="value">
                        {props.country}         
                    </div>                          
                </div>
                <div className="row">
                    <div className="label">
                        <strong>Website:</strong>   
                    </div>
                    <div className="value">
                        <a href={props.website} target="_blank">{props.website}</a>   
                    </div>                         
                </div>
                <div className="row">
                    <div className="label">
                        <strong>Telegram Handle:</strong>   
                    </div>
                    <div className="value">
                        {props.contact}            
                    </div>                         
                </div>
            </div>
            <div className="donate-panel">
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