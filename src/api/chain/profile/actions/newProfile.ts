import { execute } from '@/api/chain/actions';
import createNewProfileAction, {
  CreateNewProfileAction,
} from '@/api/chain/profile/actions/create/createNewProfileAction.ts';

export async function newProfile({ profile, session }: CreateNewProfileAction) {
  return await execute(session, [createNewProfileAction({ profile, session })]);
}
