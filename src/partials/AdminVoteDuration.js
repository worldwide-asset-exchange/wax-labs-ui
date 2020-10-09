import React, { useState , useEffect } from 'react';
import {
Link
} from 'react-router-dom';
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
        console.log(new_vote_duration);
    }

    async function updateDuration(){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs.decide',
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
                      code: 'labs.decide',
                      scope: 'labs.decide',
                      table: 'config',
                      json: true,
                  });
                  setDuration(resp.rows[0].vote_duration);
                } catch(e) {
                  console.log(e);
            }
        }
        getDuration();
     }, []);

    return (
        <div className="admin-content">
            <div className="current_duration">{vote_duration}</div>
            <input type="number" onChange={handleInputChange} />
            <button onClick={updateDuration}>Update Voting Duration</button>
        </div>
    );
}