import createDeleteCategoryAction, { DeleteCategoryAction } from '@/api/chain/actions/create/deleteCategoryAction.ts';

import { execute } from '.';

export async function deleteCategory({ category, activeUser }: DeleteCategoryAction) {
  return await execute(activeUser, [createDeleteCategoryAction({ category, activeUser })]);
}
