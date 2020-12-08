import React, { useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import * as globals from "../../utils/vars"
import { requestedAmountToFloat } from '../../utils/util';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderVoteDisplay(props){
 
    function RenderVoteButtons(props){
        return (
            <React.Fragment>
                <button className="btn" name="yes" onClick={castVote}>Vote Yes</button>
                <button className="btn" name="no" onClick={castVote}>Vote No</button>
            </React.Fragment>
        )
    }

    async function getVoteData(){
         /*Getting vote info */
         if(props.proposal.ballot_name){
             try{
                 let currentVote = await wax.rpc.get_table_rows({             
                    code: globals.DECIDE_CODE,
                    scope: globals.DECIDE_SCOPE,
                    table: globals.BALLOTS_TABLE,
                    json: true,
                    lower_bound: props.proposal.ballot_name,
                    upper_bound: props.proposal.ballot_name,
                    limit: 1000
                });
                console.log(currentVote);
                let yesVotes = currentVote.rows[0].options.filter(option => option.key === "yes")[0]
                let noVotes = currentVote.rows[0].options.filter(option => option.key === "no")[0]
                let end_time = currentVote.rows[0].end_time;
                
                yesVotes = requestedAmountToFloat(yesVotes.value, " VOTE");
                noVotes = requestedAmountToFloat(noVotes.value, " VOTE");
        
                props.updateVotes({yes: yesVotes, no: noVotes});
                props.updateEndTime(end_time);
             } catch(e){
                 console.log(e);
             }
         }
    }
    
    async function castVote(event){
        
        const voteOption = event.target.name;
        let activeUser = props.activeUser;
        let proposal = props.proposal;
        try{
            let checkRegistry = await wax.rpc.get_table_rows({             
                code: globals.DECIDE_CODE,
                scope: activeUser.accountName,
                table: globals.VOTERS_TABLE,
                json: true
            });
            let actions = []
            /* Adding regvoter action to the actions array, if this is his first time voting */
            if(!checkRegistry.rows.length){
                actions = [
                    {
                        account: globals.OIG_CODE,
                        name: globals.REGISTER_VOTER_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            voter: activeUser.accountName,
                            treasury_symbol: '8,VOTE',
                        },
                    }
                ]
            }
            await activeUser.signTransaction({
                actions: [
                    /* Spreading nothing in case voter was in the registry, or the regvoter action. */
                    ...actions,
                    {
                        account: globals.DECIDE_CODE,
                        name: globals.SYNC_ACTION,
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: activeUser.requestPermission,
                        }],
                        data: {
                            voter: activeUser.accountName,
                            },
                        },
                    {
                        account: globals.DECIDE_CODE,
                        name: globals.CAST_VOTE_ACTION,
                        authorization: [{
                                actor: activeUser.accountName,
                                permission: activeUser.requestPermission,
                        }],
                        data: {
                            voter: activeUser.accountName,
                            options: [voteOption],
                            ballot_name: proposal.ballot_name
                        },
                    }
                ]}, {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            let alertObj = {
                title: "Voted " + voteOption + " successfully!",
                body: "Vote was cast successfully", 
                variant: "success",
                dismissible: true,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();

        } catch(e){
            let alertObj = {
                title: "Voting error!",
                body: "Voting encountered an error.",
                details: e.message, 
                variant: "danger",
                dismissible: true,
            }
            props.showAlert(alertObj);
            console.log(e);
        }
    }

    useEffect(()=>{
        getVoteData();
        //eslint-disable-next-line
    }, [props.proposal])

    if(props.proposal.ballot_name){
        return (
            <div className="vote-info">
                <p><strong>Yes: </strong> {props.votes.yes}</p>
                <p><strong>No: </strong> {props.votes.no}</p>
                {props.proposal.status === "voting" ? <RenderVoteButtons /> : ""}
                <p><strong>Voting {props.votingEndsIn.includes('ago') ? "ended" : "ends"}:</strong> {props.votingEndsIn} on {props.endTime}</p> 
            </div>
        )
    }
    return (
        <p> <strong>No voting data for this proposal.</strong></p>
    )

}