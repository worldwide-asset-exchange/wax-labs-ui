import { createContext } from 'react';

import { Proposal } from '@/api/models/proposal';
import { ProposalStatus, ProposalStatusKey } from '@/constants';
import { noop } from '@/utils/common';

interface AdminProposalBarContextProps {
  proposal: Proposal | undefined;
  onChangeStatus: (status: ProposalStatusKey) => void;
  status: ProposalStatus;
}

export const AdminProposalBarContext = createContext<AdminProposalBarContextProps>({
  proposal: undefined,
  onChangeStatus: noop,
  status: ProposalStatus.APPROVED,
});
