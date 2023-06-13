import createAddCategoryAction, { AddCategoryAction } from '@/api/chain/actions/create/addCategoryAction.ts';

import { execute } from './execute';

export async function addCategory({ category, activeUser }: AddCategoryAction) {
  return await execute(activeUser, [createAddCategoryAction({ category, activeUser })]);
}
