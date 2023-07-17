import { execute } from '@/api/chain/actions';
import createSetMinRequestedAction, {
  CreateSetMinRequestedAction,
} from '@/api/chain/admin/actions/create/createSetMinRequestedAction.ts';

export async function setMinRequested({ minRequested, session }: CreateSetMinRequestedAction) {
  return await execute(session, [createSetMinRequestedAction({ minRequested, session })]);
}
