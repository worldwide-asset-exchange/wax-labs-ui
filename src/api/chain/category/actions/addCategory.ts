import { execute } from '@/api/chain/actions';
import createAddCategoryAction, {
  CreateAddCategoryAction,
} from '@/api/chain/category/actions/create/createAddCategoryAction.ts';

export async function addCategory({ category, activeUser }: CreateAddCategoryAction) {
  return await execute(activeUser, [createAddCategoryAction({ category, activeUser })]);
}
