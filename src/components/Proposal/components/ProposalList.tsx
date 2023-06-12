import { ReactNode } from 'react'

interface ProposalListProps {
  view?: 'grid' | 'list'
  children: ReactNode
}

export function ProposalList({ view = 'grid', children }: ProposalListProps) {
  return (
    <div
      data-view={view}
      className="group/proposal-list grid-col-1 mx-auto grid w-full max-w-7xl gap-1 px-1 md:grid-cols-2 md:gap-4 md:px-4 lg:grid-cols-3 data-[view=list]:lg:grid-cols-1"
    >
      {children}
    </div>
  )
}
