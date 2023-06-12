import { proposalStatus } from '@/resources/proposalStatus'
interface StatusTagProps {
  status: proposalStatus
}

export function StatusTag({ status }: StatusTagProps) {
  const className = ['status-tag', status.replace(' ', '-')].join(' ')

  return <span className={className}>{status}</span>
}
