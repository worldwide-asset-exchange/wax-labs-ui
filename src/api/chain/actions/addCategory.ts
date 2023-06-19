import createAddCategoryAction, {
  CreateAddCategoryAction,
} from '@/api/chain/actions/create/createAddCategoryAction.ts';

import { execute } from './execute';

export async function addCategory({ category, activeUser }: CreateAddCategoryAction) {
  return await execute(activeUser, [createAddCategoryAction({ category, activeUser })]);
}
