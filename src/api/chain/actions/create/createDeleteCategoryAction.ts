import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { DeleteCategory } from '@/api/models/actions';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface CreateDeleteCategoryAction {
  category: string;
  activeUser: WaxUser;
}

export default function createDeleteCategoryAction({
  category,
  activeUser: { accountName, requestPermission },
}: CreateDeleteCategoryAction): Action<DeleteCategory> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.REMOVE_CATEGORY,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      category_name: category,
    },
  };
}
