import { Action, SessionProps } from '@/api/models';
import { NewCategory } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateAddCategoryAction extends SessionProps {
  category: string;
}

export default function createAddCategoryAction({ category, session }: CreateAddCategoryAction): Action<NewCategory> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.ADD_CATEGORY,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      new_category: category,
    },
  };
}
