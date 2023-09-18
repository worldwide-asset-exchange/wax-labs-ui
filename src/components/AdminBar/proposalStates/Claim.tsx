import { useTranslation } from 'react-i18next';

import { claimFunds } from '@/api/chain/proposals';
import { Deliverables } from '@/api/models/deliverables.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { Button } from '@/components/Button.tsx';
import { DeliverableStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

export function Claim({
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
  const { toast } = useToast();

  if (
    proposal.proposer !== actor ||
    deliverable.recipient !== actor ||
    DeliverableStatusKey.ACCEPTED !== deliverable.status
  ) {
    return null;
  }

  const onAcceptReport = async () => {
    try {
      await claimFunds({
        session: session!,
        proposalId: proposal.proposal_id,
        deliverableId: deliverable.deliverable_id!,
      });

      toast({ description: t('admin.claim.claimSuccess'), variant: 'success' });

      onChange(DeliverableStatusKey.CLAIMED);
    } catch (e) {
      console.log('onSetReviewer error', e);
    }
  };

  return (
    <div className="flex w-full justify-end pt-8">
      <Button variant="primary" onClick={onAcceptReport}>
        {t('admin.claim.claimLabel')}
      </Button>
    </div>
  );
}
