import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { reviewProposal } from '@/api/chain/reviewer/actions/reviewProposal.ts';
import { InputDialog, InputDialogProps } from '@/components/AdminBar/InputDialog.tsx';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function AskForChangesComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const [openRejectionResponse, setOpenRejectionResponse] = useState(false);
  const { session } = useChain();
  const { toast } = useToast();

  const onAskForChanges: InputDialogProps['onSubmit'] = async ({ value }) => {
    try {
      await reviewProposal({
        session: session!,
        proposalId: proposal!.proposal_id,
        memo: value,
        approve: false,
        draft: true,
      });

      toast({ description: t('admin.approve.approveProposalSuccess'), variant: 'success' });

      onChangeStatus(ProposalStatusKey.FAILED_DRAFT);
    } catch (e) {
      console.log('onCommunityApproval error: ', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setOpenRejectionResponse(true)}>
        {t('admin.approve.askForChanges')}
      </Button>

      <InputDialog
        label={t('admin.approve.enterRequiredChangesLabel')!}
        zodValidationMessage={t('admin.approve.waxMessageErrorEmpty')!}
        maxLength={350}
        open={openRejectionResponse}
        title={t('admin.approve.askForChanges')}
        onSubmit={onAskForChanges}
        type="textarea"
        onClose={() => setOpenRejectionResponse(false)}
        disableOnDirty
      />
    </>
  );
}

export const AskForChanges = forwardRef(AskForChangesComponent);
