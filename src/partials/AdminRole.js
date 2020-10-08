import React, { useState } from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderAdminRole(props){
    const [admin, updateAdminState] = useState('');
    
    function handleInputChange(event) {
        const value = event.target.value;

        updateAdminState(prevState => {
            return { ...prevState, admin: value }
          }
        );
    }

    async function updateAdmin(){
        try {
            let actions = [
                {
                    account: 'labs.decide',
                    name: 'setadmin',
                    authorization: [{
                        actor: props.accountName,
                        permission: 'active',
                    }],
                    data: {
                        new_admin: admin,
                    },
                },
            ]
        
            const adminTransaction = {
              actions: actions
            };
        
            await props.activeUser.signTransaction(
              adminTransaction, {
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
            <input type="text" name="admin" onChange={handleInputChange} />
            <button onSubmit={updateAdmin}>Assign Admin</button>
        </div>
    );
}