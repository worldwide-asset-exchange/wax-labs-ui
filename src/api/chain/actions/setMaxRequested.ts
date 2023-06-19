import createSetMaxRequestedAction, {
  CreateSetMaxRequestedAction,
} from '@/api/chain/actions/create/createSetMaxRequestedAction.ts';

import { execute } from './execute';

export async function setMaxRequested({ maxRequested, activeUser }: CreateSetMaxRequestedAction) {
  return await execute(activeUser, [createSetMaxRequestedAction({ maxRequested, activeUser })]);
}
