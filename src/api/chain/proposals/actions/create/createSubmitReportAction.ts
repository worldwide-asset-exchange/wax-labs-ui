import { Action, SessionProps } from '@/api/models';
import { SubmitReport } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSubmitReportAction extends SessionProps {
  proposalId: number;
  deliverableId: number;
  report: string;
}

export default function createSubmitReportAction({
  session,
  proposalId,
  deliverableId,
  report,
}: CreateSubmitReportAction): Action<SubmitReport> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SUBMIT_REPORT,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposal_id: proposalId,
      report,
      deliverable_id: deliverableId,
    },
  };
}
