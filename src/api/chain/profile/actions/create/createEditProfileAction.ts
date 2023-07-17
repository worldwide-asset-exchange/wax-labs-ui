import { Action, SessionProps } from '@/api/models';
import { Profile } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateEditProfileAction extends SessionProps {
  profile: Profile;
}

export default function createEditProfileAction({ profile, session }: CreateEditProfileAction): Action<Profile> {
  const accountName = session.actor.toString();

  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.EDIT_PROFILE,
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
