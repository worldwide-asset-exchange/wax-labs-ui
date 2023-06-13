import { forwardRef, ReactNode, Ref } from 'react';

import { getDataViewDefault } from '../proposalView';

interface ProposalRootProps {
  children: ReactNode;
}

function ProposalRootComponent({ children }: ProposalRootProps, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} data-view={getDataViewDefault} className="group/proposal-root space-y-4">
      {children}
    </div>
  );
}

export const ProposalRoot = forwardRef(ProposalRootComponent);
