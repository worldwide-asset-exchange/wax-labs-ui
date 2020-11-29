import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderVoteDisplay(props){
    RenderVoteDisplay.propTypes ={
        proposal: PropTypes.any.isRequired,
        votes: PropTypes.any.isRequired,
        queryCount: PropTypes.any.isRequired,
        activeUser: PropTypes.any.isRequired,
        endTime: PropTypes.any.isRequired,
        endsIn: PropTypes.any.isRequired,
        updateVote: PropTypes.func.isRequired,
        updateEndTime: PropTypes.func.isRequired,
    }
    async function getVoteData(){
         /*Getting vote info */
         try{
             let currentVote = await wax.rpc.get_table_rows({             
                code: 'decide',
                scope: 'decide',
                table: 'ballots',
                json: true,
                lower_bound: props.proposal.ballot_name,
                upper_bound: props.proposal.ballot_name,
                limit: 1
            });
            let yesVotes = currentVote.rows[0].options.filter(option => option.key === "yes")[0]
            let noVotes = currentVote.rows[0].options.filter(option => option.key === "no")[0]
            let end_time = currentVote.rows[0].end_time;
            /*Removing the ".00000000 VOTE" from the string, and converting to integer.*/
            yesVotes = parseInt(yesVotes.slice(0, -14));
            noVotes = parseInt(noVotes.slice(0, -14));
    
            props.updateVote({yes: yesVotes, no: noVotes});
            props.updateEndTime(end_time);
         } catch(e){
             console.log(e);
         }
    }

    async function castVote(event){
        const voteOption = event.target.name;
        let activeUser = props.activeUser;
        let proposal = props.proposal;
        try{
            let checkRegistry = await wax.rpc.get_table_rows({             
                code: 'decide',
                scope: activeUser.accountName,
                table: 'voters',
                json: true
            });
            let actions = []
            /* Adding regvoter action to the actions array, if this is his first time voting */
            if(!checkRegistry.rows.length){
                actions = [
                    {
                        account: 'oig',
                        name: 'regvoter',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
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
                        account: 'decide',
                        name: 'sync',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            voter: activeUser.accountName,
                            },
                        },
                    {
                        account: 'decide',
                        name: 'castvote',
                        authorization: [{
                                actor: activeUser.accountName,
                                permission: 'active',
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

        } catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        getVoteData();
    }, [props.proposal, props.queryCount])
}