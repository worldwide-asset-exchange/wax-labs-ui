import { execute } from '@/api/chain/actions';
import createSetMaxRequestedAction, {
  CreateSetMaxRequestedAction,
} from '@/api/chain/proposals/actions/create/createSetMaxRequestedAction.ts';

export async function setMaxRequested({ maxRequested, session }: CreateSetMaxRequestedAction) {
  return await execute(session, [createSetMaxRequestedAction({ maxRequested, session })]);
}
