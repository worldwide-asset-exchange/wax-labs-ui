import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RenderRemoveAccount(props){
    const [wax_account, setAccount] = useState('');
    const activeUser = props.activeUser;
    
    function handleInputChange(event) {
        const value = event.target.value;

        setAccount(prevState => {
            return { ...prevState, wax_account: value }
          }
        );
    }

    async function removeProfile(){
        console.log(activeUser);
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'rmvprofile',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            wax_account: wax_account.wax_account,
                        },
                    },
                ]}, {
                blocksBehind: 3,
                expireSeconds: 30
            });
        } catch(e) {
            console.log(e);
        }
    }

    async function deleteAccount(){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'deleteacct',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            account_name: wax_account.wax_account,
                        },
                    },
                ]}, {
                blocksBehind: 3,
                expireSeconds: 30
            });
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <div className="admin-content-wrapper">
            <div className="admin-submenu">
                <ul>
                    <li><Link className="btn" to="/admin">Back to Admin Menu</Link></li>
                </ul>
            </div>
            <div className="admin-content">
                <h3>Remove Profile</h3>
                <div>
                    <input type="text" name="wax_account" onChange={handleInputChange} />
                    <button className="btn" onClick={removeProfile}>Remove Profile</button>
                    <button className="btn" onClick={deleteAccount}>Delete Account</button>
                </div>
            </div>
        </div>
    );
}