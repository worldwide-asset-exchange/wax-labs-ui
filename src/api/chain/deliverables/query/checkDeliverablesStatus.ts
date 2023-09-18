import { UInt64 } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { DeliverablesStatusToCheck } from '@/api/models/common.ts';
import { Deliverables } from '@/api/models/deliverables.ts';
import { LABS_CONTRACT_ACCOUNT, NotificationType, Tables } from '@/constants.ts';

export interface CheckDeliverablesStatus {
  proposalId: number;
  deliverableId: number;
  notificationType: NotificationType;
}

export async function checkDeliverablesStatus({
  proposalId,
  statusToCheck,
}: {
  proposalId: number;
  statusToCheck: DeliverablesStatusToCheck[];
}): Promise<CheckDeliverablesStatus[]> {
  try {
    const { rows } = (await waxClient.v1.chain.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: UInt64.from(proposalId),
      table: Tables.DELIVERABLES,
      json: true,
      limit: 1000,
    })) as GetTableRowsResult<Deliverables>;

    const results: { deliverableId: number; notificationType: NotificationType }[] = [];
    rows.forEach(d => {
      results.push(
        ...statusToCheck
          .filter(({ deliverableStatusKey }) => d.deliverable_id && d.status === deliverableStatusKey)
          .map(({ notificationType }) => ({
            deliverableId: d.deliverable_id!,
            notificationType,
          }))
      );
    });

    return results.map(({ notificationType, deliverableId }) => ({ proposalId, deliverableId, notificationType }));
  } catch (e) {
    console.error('[checkDeliverablesStatus]', e);
  }

  return [];
}
