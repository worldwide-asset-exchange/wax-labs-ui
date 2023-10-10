import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { submitReport } from '@/api/chain/proposals';
import { Deliverables } from '@/api/models/deliverables.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { refreshStatus } from '@/api/notifications.ts';
import { InputDialog, InputDialogProps } from '@/components/AdminBar/InputDialog.tsx';
import { Button } from '@/components/Button.tsx';
import { DeliverableStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

export function SubmitReport({
  proposal,
  deliverable,
  onChange,
}: {
  proposal: Proposal;
  deliverable: Deliverables;
  onChange: (status: DeliverableStatusKey) => void;
}) {
  const { t } = useTranslation();
  const { actor, session } = useChain();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  if (proposal.proposer !== actor || deliverable.status !== DeliverableStatusKey.IN_PROGRESS) {
    return null;
  }
  const onSubmitReport: InputDialogProps['onSubmit'] = async ({ value }) => {
    try {
      await Promise.all([
        submitReport({
          session: session!,
          proposalId: proposal.proposal_id,
          deliverableId: deliverable.deliverable_id!,
          report: value,
        }),
        refreshStatus(proposal!.proposal_id),
      ]);

      toast({ description: t('admin.submitReport.submitReportSuccess'), variant: 'success' });

      onChange(DeliverableStatusKey.REPORTED);
    } catch (e) {
      console.log('onSubmitReport error', e);
    }
  };

  return (
    <div className="flex w-full justify-end pt-8">
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        {t('submitReport')}
      </Button>

      <InputDialog
        label={t('admin.submitReport.submitReportLabel')!}
        maxLength={1000}
        open={isOpen}
        title={t('submitReport')}
        onSubmit={onSubmitReport}
        onClose={() => setIsOpen(false)}
        zodValidation={z.string().url().nonempty(t('messageErrorEmpty')!).min(1).max(1000)}
        disableOnDirty
      />
    </div>
  );
}
