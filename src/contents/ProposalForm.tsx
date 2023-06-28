import { useSearchParams } from 'react-router-dom';

import { ProposalFormStep1 } from '@/components/ProposalForm/ProposalFormStep1';
import { ProposalFormStep2 } from '@/components/ProposalForm/ProposalFormStep2';
import { ProposalFormStep3 } from '@/components/ProposalForm/ProposalFormStep3';
import { ProposalFormStep4 } from '@/components/ProposalForm/ProposalFormStep4';

export function ProposalForm() {
  const [searchParams] = useSearchParams();

  const step = Number(searchParams.get('step')) || 1;

  if (step === 1) {
    return <ProposalFormStep1 />;
  }

  if (step === 2) {
    return <ProposalFormStep2 />;
  }

  if (step === 3) {
    return <ProposalFormStep3 />;
  }

  if (step === 4) {
    return <ProposalFormStep4 />;
  }

  return <></>;
}
