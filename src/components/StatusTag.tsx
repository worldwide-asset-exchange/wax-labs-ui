import { ProposalStatus } from '@/constants.ts';

interface StatusTagProps {
  status: ProposalStatus;
}

export function StatusTag({ status }: StatusTagProps) {
  const className = ['status-tag', status.replace(/\s/g, '-')].join(' ');

  return <span className={className}>{status}</span>;
}
