import { Action, SessionProps } from '@/api/models';
import { SetAdmin } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSetAdminAction extends SessionProps {
  newAdmin: string;
}

export default function createSetAdminAction({ session, newAdmin }: CreateSetAdminAction): Action<SetAdmin> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SET_ADMIN,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      new_admin: newAdmin,
    },
  };
}
