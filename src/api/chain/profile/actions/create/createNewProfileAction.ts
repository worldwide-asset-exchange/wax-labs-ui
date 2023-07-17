import { Action, SessionProps } from '@/api/models';
import { Profile } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateNewProfileAction extends SessionProps {
  profile: Profile;
}

export default function createNewProfileAction({ profile, session }: CreateNewProfileAction): Action<Profile> {
  const accountName = session.actor.toString();

  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.NEW_PROFILE,
    authorization: [
      {
        actor: accountName,
        permission: session.permission.toString(),
      },
    ],
    data: {
      ...profile,
      wax_account: accountName,
    },
  };
}
