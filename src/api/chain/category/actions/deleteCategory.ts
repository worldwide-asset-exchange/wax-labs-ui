import { execute } from '@/api/chain/actions';
import createDeleteCategoryAction, {
  CreateDeleteCategoryAction,
} from '@/api/chain/category/actions/create/createDeleteCategoryAction.ts';

export async function deleteCategory({ category, session }: CreateDeleteCategoryAction) {
  return await execute(session, [createDeleteCategoryAction({ category, session })]);
}
