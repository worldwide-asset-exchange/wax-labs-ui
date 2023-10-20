import { execute } from '@/api/chain/actions';
import createRemoveProfileAction, {
  CreateRemoveProfileAction,
} from '@/api/chain/profile/actions/create/createRemoveProfileAction.ts';

export async function removeProfile({ waxAccount, session }: CreateRemoveProfileAction) {
  return await execute(session, [createRemoveProfileAction({ waxAccount, session })]);
}
