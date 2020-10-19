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
        <div className="admin-content">
            <Link to="/admin">Return to Admin Menu</Link>
            <h2>Assign WAX Labs Admin Account</h2>
            <input type="text" name="new_admin" onChange={handleInputChange} />
            <button className="btn" onClick={updateAdmin}>Assign Admin</button>
        </div>
    );
}