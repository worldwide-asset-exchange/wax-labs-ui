import createSetMinRequestedAction, {
  CreateSetMinRequestedAction,
} from '@/api/chain/actions/create/createSetMinRequestedAction.ts';

import { execute } from './execute';

export async function setMinRequested({ minRequested, activeUser }: CreateSetMinRequestedAction) {
  return await execute(activeUser, [createSetMinRequestedAction({ minRequested, activeUser })]);
}
