import { execute } from '@/api/chain/actions';
import createRemoveProfileAction, {
  CreateRemoveProfileAction,
} from '@/api/chain/profile/actions/create/createRemoveProfileAction.ts';

export async function removeProfile({ waxAccount, activeUser }: CreateRemoveProfileAction) {
  return await execute(activeUser, [createRemoveProfileAction({ waxAccount, activeUser })]);
}
