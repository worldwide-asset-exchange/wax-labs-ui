import {
  MdAttachMoney,
  MdFingerprint,
  MdOutlineCalendarToday,
  MdOutlineLabel,
  MdOutlinePerson,
  MdPlaylistAddCheck
} from 'react-icons/md'

import { StatusTag } from '@/components/StatusTag'
import { proposalStatus } from '@/resources/proposalStatus'

interface ProposalItemProps {
  title: string
  shortDescription: string
  status: proposalStatus
  deliverables: string
  id: string | number
  requestedAmount: string
  proposer: string
  category: string
  lastUpdate: string
}

export function ProposalItem({
  title,
  shortDescription,
  status,
  deliverables,
  id,
  requestedAmount,
  proposer,
  category,
  lastUpdate
}: ProposalItemProps) {
  return (
    <div className="group/proposal-item flex cursor-pointer flex-col divide-y divide-subtle-light rounded-xl bg-subtle p-4 duration-150 hover:ring-1 hover:ring-accent-dark group-data-[view=list]/proposal-list:lg:flex-row group-data-[view=list]/proposal-list:lg:divide-y-0">
      <div className="flex-1 space-y-4 p-4">
        <h3 className="title-3 text-high-contrast group-hover/proposal-item:text-accent">{title}</h3>
        <p className="body-2 text-low-contrast">{shortDescription}</p>
        <StatusTag status={status} />
      </div>

      <div className="label-1 mx-4 flex-1 divide-y divide-subtle-light text-low-contrast">
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdPlaylistAddCheck size={24} />
            </div>
            <div className="flex-1 truncate">{deliverables}</div>
          </div>
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdFingerprint size={24} />
            </div>
            <div className="flex-1 truncate">{id}</div>
          </div>
        </div>
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdAttachMoney size={24} />
            </div>
            <div className="flex-1 truncate">{requestedAmount}</div>
          </div>
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdOutlinePerson size={24} />
            </div>
            <div className="flex-1 truncate">{proposer}</div>
          </div>
        </div>
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdOutlineLabel size={24} />
            </div>
            <div className="flex-1 truncate">{category}</div>
          </div>
          <div className="flex flex-1 items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex-none">
              <MdOutlineCalendarToday size={24} />
            </div>
            <div className="flex-1 truncate">{lastUpdate}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
