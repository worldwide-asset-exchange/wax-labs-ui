import React, { useState } from 'react';
import {
Link
} from 'react-router-dom';

export default function RenderAdminRole(props){
    const [admin, updateAdminState] = useState('');
    const activeUser = props.activeUser;
    
    function handleInputChange(event) {
        const value = event.target.value;

        updateAdminState(prevState => {
            return { ...prevState, admin: value }
          }
        );
    }

    async function updateAdmin(){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'setadmin',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            new_admin: admin.admin,
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
                <h3>Assign WAX Labs Admin Account</h3>
                <div className="assign-account">
                    <input type="text" name="new_admin" onChange={handleInputChange} />
                    <button className="btn" onClick={updateAdmin}>Assign Admin</button>
                </div>
            </div>
        </div>
    );
}