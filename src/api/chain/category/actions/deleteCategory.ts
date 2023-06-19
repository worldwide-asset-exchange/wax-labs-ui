import { execute } from '@/api/chain/actions';
import createDeleteCategoryAction, {
  CreateDeleteCategoryAction,
} from '@/api/chain/category/actions/create/createDeleteCategoryAction.ts';

export async function deleteCategory({ category, activeUser }: CreateDeleteCategoryAction) {
  return await execute(activeUser, [createDeleteCategoryAction({ category, activeUser })]);
}
