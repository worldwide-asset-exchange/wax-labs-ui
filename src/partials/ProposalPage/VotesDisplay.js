import React, { useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import * as globals from "../../utils/vars"
import * as alertGlobals from '../../utils/alerts'
import RenderSignInButton from '../SignInButton'

import { requestedAmountToFloat } from '../../utils/util';

import './VotesDisplay.scss'

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderVoteDisplay(props){

    function RenderVoteButtons(props){
        if (props.showActionButtons) {
            if (props.activeUser) {
            return (
                <div className="votesDisplay__buttons">
                    <button className="button button--approval" name="yes" onClick={castVote}>Vote Yes</button>
                    <button className="button button--rejection" name="no" onClick={castVote}>Vote No</button>
                </div>
            )
            } else {
                return (
                    <div className="votesDisplay__signInButton">
                        <RenderSignInButton suffixMessage={'to vote'} loginModal={props.loginModal}/>
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    function RenderVotingPercentages(props) {
        const yesPercentage = `${(props.yesVotes * 100 / props.totalVotes).toFixed(0)}%`
        const noPercentage = `${(props.noVotes * 100 / props.totalVotes).toFixed(0)}%`
        return (
        <React.Fragment>
            <div>
                <p className="votesDisplay__label">Yes</p>
                <div className="votesDisplay__bar votesDisplay__bar--yes"
                    style={{
                        width: `${yesPercentage}`
                    }}>
                    <h4 className="votesDisplay__percentage">{yesPercentage}</h4>
                </div>
            </div>
            <div>
                <p className="votesDisplay__label">No</p>
                <div className="votesDisplay__bar votesDisplay__bar--no"
                    style={{
                        width: `${noPercentage}`
                    }}>
                    <h4 className="votesDisplay__percentage">{noPercentage}</h4>
                </div>
            </div>
        </React.Fragment>
        )
    }

    async function getVoteData(){
         /*Getting vote info */
         if(props.proposal.ballot_name){
             try{
                 let currentVote = await wax.rpc.get_table_rows({
                    code: globals.DECIDE_CONTRACT_ACCOUNT,
                    scope: globals.DECIDE_CONTRACT_ACCOUNT,
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
                code: globals.DECIDE_CONTRACT_ACCOUNT,
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
                        account: globals.DECIDE_CONTRACT_ACCOUNT,
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
                        account: globals.DECIDE_CONTRACT_ACCOUNT,
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
            let body = alertGlobals.CAST_VOTE_ALERT_DICT.SUCCESS.body.slice(0)
            body = body.replace(alertGlobals.VOTE_OPTION_TEMPLATE, voteOption);
            let alertObj = {
                ...alertGlobals.CAST_VOTE_ALERT_DICT.SUCCESS,
                body: body,
            }
            props.showAlert(alertObj);
            props.rerunProposalQuery();

        } catch(e){
            let alertObj = {
                ...alertGlobals.CAST_VOTE_ALERT_DICT.ERROR,
                details: e.message,
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
        const totalVotes = props.votes.yes + props.votes.no
        return (
            <div className="votesDisplay">
                <h4 className="votesDisplay__endCountdown">Voting {props.votingEndsIn.includes('ago') ? 'ended' : 'ends'} {props.votingEndsIn}</h4>
                <p className="votesDisplay__endDate">on {props.endTime}</p>
                {totalVotes > 0 ? <RenderVotingPercentages totalVotes={totalVotes} yesVotes={props.votes.yes} noVotes={props.votes.no}/> : <h4>No votes have been cast yet.</h4>}
                {props.proposal.status === globals.VOTING_KEY ? <RenderVoteButtons {...props}/> : ""}
            </div>
        )
    } else {
        return null;
    }
}