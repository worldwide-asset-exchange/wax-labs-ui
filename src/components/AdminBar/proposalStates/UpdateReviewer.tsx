import { ComponentProps, forwardRef, Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { setReviewer } from '@/api/chain/admin';
import { InputDialog, InputDialogProps } from '@/components/AdminBar/InputDialog.tsx';
import { Button } from '@/components/Button.tsx';
import { useChain } from '@/hooks/useChain.ts';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { useToast } from '@/hooks/useToast.ts';

function UpdateReviewerComponent(props: ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) {
  const { data: proposal, onChangeStatus } = useSingleProposal();

  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { actor, session } = useChain();
  const { toast } = useToast();

  const onSetReviewer: InputDialogProps['onSubmit'] = async ({ value }) => {
    try {
      await setReviewer({
        session: session!,
        newReviewer: value,
        proposalId: proposal!.proposal_id,
      });

      toast({ description: t('admin.reviewer.setReviewerSuccess'), variant: 'success' });

      await onChangeStatus(proposal!.status);
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <>
      <Button {...props} ref={ref} variant="link" square onClick={() => setIsOpen(true)}>
        {proposal!.reviewer ? t('admin.reviewer.updateReviewer') : t('admin.reviewer.setReviewer')}
      </Button>

      <InputDialog
        label={t('admin.approve')!}
        placeholder={t('admin.approve.reviewerPlaceholder')!}
        zodValidationMessage={t('admin.approve.messageErrorEmpty')!}
        maxLength={12}
        open={isOpen}
        defaultValue={proposal!.reviewer || actor}
        title={proposal!.reviewer ? t('admin.reviewer.updateReviewer') : t('admin.reviewer.setReviewer')}
        onSubmit={onSetReviewer}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export const UpdateReviewer = forwardRef(UpdateReviewerComponent);
