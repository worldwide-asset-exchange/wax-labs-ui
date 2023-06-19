import { ReactNode } from 'react';

import { ProposalFilter } from './ProposalFilter';

interface ProposalRootProps {
  children: ReactNode;
}

export function ProposalRoot({ children }: ProposalRootProps) {
  const dataView = localStorage.getItem('@WaxLabs:v1:proposal-view') ?? 'grid';

  return (
    <div data-view={dataView} className="group/proposal-root space-y-4">
      <ProposalFilter />
      {children}
    </div>
  );
}
