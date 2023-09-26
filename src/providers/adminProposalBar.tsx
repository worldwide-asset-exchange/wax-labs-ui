import { ReactNode, useState } from 'react';

import { Proposal } from '@/api/models/proposal';
import { ProposalStatusKey } from '@/constants';
import { AdminProposalBarContext } from '@/contexts/adminProposalBar';
import { toProposalStatus } from '@/utils/proposalUtils';

interface AdminProposalBarProviderProps {
  proposal: Proposal;
  refetch: () => void;
  children: ReactNode;
}

export function AdminProposalBarProvider({ proposal, refetch, children }: AdminProposalBarProviderProps) {
  const [currentStatus, setCurrentStatus] = useState<ProposalStatusKey>(proposal.status);
  const status = toProposalStatus(currentStatus);

  function onChangeStatus(status: ProposalStatusKey) {
    setCurrentStatus(status);
    refetch();
  }

  return (
    <AdminProposalBarContext.Provider
      value={{
        proposal,
        status,
        onChangeStatus,
      }}
    >
      {children}
    </AdminProposalBarContext.Provider>
  );
}
