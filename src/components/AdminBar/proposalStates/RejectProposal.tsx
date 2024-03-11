import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { reviewProposal } from '@/api/chain/reviewer/actions/reviewProposal.ts';
import { refreshStatus } from '@/api/notifications.ts';
import { InputDialog, InputDialogProps } from '@/components/AdminBar/InputDialog.tsx';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function RejectProposalComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { session } = useChain();
  const { toast } = useToast();

  const onSubmit: InputDialogProps['onSubmit'] = async ({ value }) => {
    try {
      await reviewProposal({
        session: session!,
        proposalId: proposal!.proposal_id,
        memo: value,
        approve: false,
        draft: false,
      });
      await refreshStatus(proposal!.proposal_id);

      toast({ description: t('admin.reject.rejectProposalSuccess'), variant: 'success' });

      await onChangeStatus(ProposalStatusKey.CANCELLED);
    } catch (e) {
      console.log('Reject Proposal', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpen(true)}>
        {t('admin.reject.rejectProposal')}
      </Button>

      <InputDialog
        label={t('admin.reject.rejectLabel')!}
        zodValidation={z.string().trim().nonempty(t('messageErrorEmpty')!).min(1).max(1000)}
        maxLength={1000}
        open={open}
        type="textarea"
        title={t('admin.reject.rejectProposal')}
        onSubmit={onSubmit}
        onClose={() => setOpen(false)}
        disableOnDirty
      />
    </>
  );
}

export const RejectProposal = forwardRef(RejectProposalComponent);
