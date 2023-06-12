export type StatusType =
  | 'in drafting'
  | 'in review'
  | 'approved'
  | 'in voting'
  | 'in progress'
  | 'cancelled'
  | 'rejected'
  | 'completed'

interface StatusTagProps {
  status: StatusType
}

export function StatusTag({ status }: StatusTagProps) {
  const className = ['status-tag', status.replace(' ', '-')].join(' ')

  return <span className={className}>{status}</span>
}
