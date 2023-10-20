import { ReactNode } from 'react';

interface ProposalFooterProps {
  children: ReactNode;
}

export function ProposalFooter({ children }: ProposalFooterProps) {
  return <div className="flex justify-center p-4 pb-8">{children}</div>;
}
