import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { NewCategory } from '@/api/models/actions';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface CreateAddCategoryAction {
  category: string;
  activeUser: WaxUser;
}

export default function createAddCategoryAction({
  category,
  activeUser: { accountName, requestPermission },
}: CreateAddCategoryAction): Action<NewCategory> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.ADD_CATEGORY,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      new_category: category,
    },
  };
}
