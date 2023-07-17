import { Action, SessionProps } from '@/api/models';
import { DeleteCategory } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateDeleteCategoryAction extends SessionProps {
  category: string;
}

export default function createDeleteCategoryAction({
  category,
  session,
}: CreateDeleteCategoryAction): Action<DeleteCategory> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.REMOVE_CATEGORY,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      category_name: category,
    },
  };
}
