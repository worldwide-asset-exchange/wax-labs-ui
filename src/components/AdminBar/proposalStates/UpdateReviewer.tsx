import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { setReviewer } from '@/api/chain/admin';
import { Proposal } from '@/api/models/proposal.ts';
import { InputDialog, InputDialogProps } from '@/components/AdminBar/InputDialog.tsx';
import { Button } from '@/components/Button.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

export function UpdateReviewer({
  proposal,
  onChange,
}: {
  proposal: Proposal;
  onChange: (status: ProposalStatusKey) => void;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { actor, session } = useChain();
  const { toast } = useToast();

  const onSetReviewer: InputDialogProps['onSubmit'] = async ({ value }) => {
    try {
      await setReviewer({
        session: session!,
        newReviewer: value,
        proposalId: proposal.proposal_id,
      });

      toast({ description: t('admin.reviewer.setReviewerSuccess'), variant: 'success' });

      onChange(proposal.status);
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <>
      <Button variant="tertiary" onClick={() => setIsOpen(true)}>
        {proposal.reviewer ? t('admin.reviewer.updateReviewer') : t('admin.reviewer.setReviewer')}
      </Button>
      <InputDialog
        label={t('reviewer')!}
        placeholder={t('admin.reviewer.reviewerPlaceholder')!}
        maxLength={12}
        open={isOpen}
        defaultValue={proposal.reviewer ?? actor}
        title={proposal.reviewer ? t('admin.reviewer.updateReviewer') : t('admin.reviewer.setReviewer')}
        onSubmit={onSetReviewer}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
