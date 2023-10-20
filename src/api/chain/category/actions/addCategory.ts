import { execute } from '@/api/chain/actions';
import createAddCategoryAction, {
  CreateAddCategoryAction,
} from '@/api/chain/category/actions/create/createAddCategoryAction.ts';

export async function addCategory({ category, session }: CreateAddCategoryAction) {
  return await execute(session, [createAddCategoryAction({ category, session })]);
}
