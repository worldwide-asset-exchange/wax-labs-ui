import createSetMaxRequestedAction, {
  SetMaxRequestedAction,
} from '@/api/chain/actions/create/setMaxRequestedAction.ts';

import { execute } from '.';

export async function setMaxRequested({ maxRequested, activeUser }: SetMaxRequestedAction) {
  return await execute(activeUser, [createSetMaxRequestedAction({ maxRequested, activeUser })]);
}
