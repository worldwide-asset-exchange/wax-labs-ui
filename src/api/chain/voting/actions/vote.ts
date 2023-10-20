import { execute } from '@/api/chain/actions';
import createRegVoterAction from '@/api/chain/voting/actions/create/createRegVoterAction.ts';
import createVoteAction, { CreateVoteAction } from '@/api/chain/voting/actions/create/createVoteAction.ts';
import createVotingSyncAction from '@/api/chain/voting/actions/create/createVotingSyncAction.ts';
import { hasVoted } from '@/api/chain/voting/query/hasVoted.ts';
import { Action } from '@/api/models';
import { RegVoter, Vote, Voter } from '@/api/models/voting.ts';

export async function vote({ session, ballotName, voteOption }: CreateVoteAction) {
  const hasVotedBefore = await hasVoted({ actor: session.actor.toString() });

  const actions: Action<Voter | RegVoter | Vote>[] = [
    createVotingSyncAction({ session }),
    createVoteAction({ session, ballotName, voteOption }),
  ];

  if (!hasVotedBefore) {
    actions.unshift(createRegVoterAction({ session }));
  }

  return await execute(session, actions);
}
