import createDeleteCategoryAction, {
  CreateDeleteCategoryAction,
} from '@/api/chain/actions/create/createDeleteCategoryAction.ts';

import { execute } from './execute';

export async function deleteCategory({ category, activeUser }: CreateDeleteCategoryAction) {
  return await execute(activeUser, [createDeleteCategoryAction({ category, activeUser })]);
}
