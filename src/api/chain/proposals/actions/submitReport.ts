import { execute } from '@/api/chain/actions';
import createSubmitReportAction, {
  CreateSubmitReportAction,
} from '@/api/chain/proposals/actions/create/createSubmitReportAction.ts';

export async function submitReport({ proposalId, report, deliverableId, session }: CreateSubmitReportAction) {
  return await execute(session, [createSubmitReportAction({ proposalId, report, deliverableId, session })]);
}
