import { execute } from '@/api/chain/actions';
import createEditProfileAction, {
  CreateEditProfileAction,
} from '@/api/chain/profile/actions/create/createEditProfileAction.ts';

export async function editProfile({ profile, session }: CreateEditProfileAction) {
  return await execute(session, [createEditProfileAction({ profile, session })]);
}
