import { ReactNode } from 'react';

import { ProposalFilter } from './ProposalFilter';

interface ProposalRootProps {
  children: ReactNode;
  onChangeFilters: () => void;
}

export function ProposalRoot({ children, onChangeFilters }: ProposalRootProps) {
  const dataView = localStorage.getItem('@WaxLabs:v1:proposal-view') ?? 'grid';

  return (
    <div data-view={dataView} className="group/proposal-root space-y-4">
      <ProposalFilter onChangeFilters={onChangeFilters} />
      {children}
    </div>
  );
}
