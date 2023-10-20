import { ReactNode } from 'react';

interface ProposalListProps {
  children: ReactNode;
}

export function ProposalList({ children }: ProposalListProps) {
  return (
    <div className="grid-col-1 mx-auto grid w-full max-w-7xl gap-1 px-1 md:grid-cols-2 md:gap-4 md:px-4 group-data-[view=list]/proposal-root:md:grid-cols-1 lg:grid-cols-3">
      {children}
    </div>
  );
}
