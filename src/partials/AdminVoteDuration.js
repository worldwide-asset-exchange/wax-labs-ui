import React, { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderVoteDuration(props){
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [ vote_duration , setDuration ] = useState('');
    const [ new_vote_duration , setNewDuration ] = useState('');
    const activeUser = props.activeUser;

    // Make sure the front-end has a friendly input that converts readable time to milliseconds

    function handleInputChange(event) {
        const value = event.target.value;

        setNewDuration(prevState => {
            return { ...prevState, new_vote_duration: value }
          }
        );
    }

    async function updateDuration(){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs',
                        name: 'setduration',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            new_vote_duration: new_vote_duration.new_vote_duration,
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

    useEffect(() => {
        async function getDuration() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs',
                      scope: 'labs',
                      table: 'config',
                      json: true,
                  });
                  setDuration(resp.rows[0].vote_duration);
                } catch(e) {
                  console.log(e);
            }
        }
        getDuration();
     }, [wax.rpc]);

    return (
        <div className="admin-content-wrapper">
            <Link to="/admin">Back to Admin Menu</Link>
            <div className="admin-content">
                <h3>Change Voting Period Duration</h3>
                <div className="current_duration"><strong>Current Duration:</strong> {vote_duration}</div>
                <div className="change-duration">
                    <input type="number" onChange={handleInputChange} />
                    <button className="btn" onClick={updateDuration}>Update Voting Duration</button>
                </div>
            </div>
        </div>
    );
}