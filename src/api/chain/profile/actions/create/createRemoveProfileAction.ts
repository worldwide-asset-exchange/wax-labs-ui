import { Action, SessionProps } from '@/api/models';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateRemoveProfileAction extends SessionProps {
  waxAccount?: string | null;
}

export default function createRemoveProfileAction({
  waxAccount,
  session,
}: CreateRemoveProfileAction): Action<{ wax_account: string }> {
  const accountName = session.actor.toString();

  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.REMOVE_PROFILE,
    authorization: [
      {
        actor: accountName,
        permission: session.permission.toString(),
      },
    ],
    data: {
      wax_account: waxAccount ?? accountName,
    },
  };
}
