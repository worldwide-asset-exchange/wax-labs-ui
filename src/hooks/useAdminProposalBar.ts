import { useContext } from 'react';

import { AdminProposalBarContext } from '@/contexts/adminProposalBar';

export function useAdminProposalBar() {
  const { proposal, status, onChangeStatus } = useContext(AdminProposalBarContext);

  return {
    proposal,
    status,
    onChangeStatus,
  };
}
