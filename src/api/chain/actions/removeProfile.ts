import createRemoveProfileAction, {
  CreateRemoveProfileAction,
} from '@/api/chain/actions/create/createRemoveProfileAction.ts';

import { execute } from './execute';

export async function removeProfile({ waxAccount, activeUser }: CreateRemoveProfileAction) {
  return await execute(activeUser, [createRemoveProfileAction({ waxAccount, activeUser })]);
}
