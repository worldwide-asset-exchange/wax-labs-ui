import { execute } from '@/api/chain/actions';
import createAddDeliverableAction, {
  CreateAddDeliverableAction,
} from '@/api/chain/deliverables/actions/create/createAddDeliverableAction.ts';
import { SessionProps } from '@/api/models';

export async function addDeliverables({
  session,
  deliverables,
}: {
  deliverables: Omit<CreateAddDeliverableAction, 'session'>[];
} & SessionProps) {
  return await execute(
    session,
    deliverables.map(d => createAddDeliverableAction({ ...d, session }))
  );
}
