import { execute } from '@/api/chain/actions';
import createSetMinRequestedAction, {
  CreateSetMinRequestedAction,
} from '@/api/chain/proposals/actions/create/createSetMinRequestedAction.ts';

export async function setMinRequested({ minRequested, activeUser }: CreateSetMinRequestedAction) {
  return await execute(activeUser, [createSetMinRequestedAction({ minRequested, activeUser })]);
}
