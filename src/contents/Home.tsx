import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'

import proposalLifecycleImg from '../assets/proposal-lifecycle.png'
import { Button } from '../components/Button'
import strings from '../resources/strings'

const mockedStats = {
  inReview: 2,
  inVoting: 0,
  inProgress: 14,
  completed: 28,
  operationalFunds: 689210,
  additionalFunds: 159469353.65
}

export const Home: React.FC = () => {
  const [stats, setStats] = useState(mockedStats)

  useEffect(() => {
    setStats(mockedStats)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center text-center text-high-contrast">
      <div className="display-1 mt-40 max-w-[800px]">{strings.homeTitle}</div>
      <div className="m-8">
        <Button variant="primary">{strings.seeProposals}</Button>
      </div>
      <div className="my-40 grid grid-cols-2 gap-1 text-start">
        <div className="grid grid-rows-2 gap-1">
          <div className="grid gap-1">
            <div className="title-2 rounded-xl bg-subtle p-12">{strings.homeDescription}</div>
          </div>
          <div className="grid gap-1">
            <div className="rounded-xl bg-subtle p-12">
              <div className="label-2">{strings.operationalFunds}</div>
              <div className="title-2">
                {stats.operationalFunds.toLocaleString('en-US', { minimumFractionDigits: 2 })} {strings.wax}
              </div>
            </div>
            <div className="rounded-xl bg-subtle p-12">
              <div className="label-2">{strings.additionalFunds}</div>
              <div className="title-2">
                {stats.additionalFunds.toLocaleString('en-US', { minimumFractionDigits: 2 })} {strings.wax}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="flex flex-col justify-between rounded-xl bg-[#212C59] p-12 text-[#899CF8]">
            <div>
              <div className="display-1">{stats.inReview}</div>
              <div className="label-2">{strings.inReview}</div>
            </div>
            <div className="flex justify-end">
              <Button square variant="secondary">
                <MdKeyboardArrowRight size={24} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-xl bg-[#4A250D] p-12 text-[#F09150]">
            <div>
              <div className="display-1">{stats.inVoting}</div>
              <div className="label-2">{strings.inVoting}</div>
            </div>
            <div className="flex justify-end">
              <Button square variant="secondary">
                <MdKeyboardArrowRight size={24} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-xl bg-[#3F2353] p-12 text-[#B57DE9]">
            <div>
              <div className="display-1">{stats.inProgress}</div>
              <div className="label-2">{strings.inProgress}</div>
            </div>
            <div className="flex justify-end">
              <Button square variant="secondary">
                <MdKeyboardArrowRight size={24} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-xl bg-[#213824] p-12 text-[#7BBF7C]">
            <div>
              <div className="display-1">{stats.completed}</div>
              <div className="label-2">{strings.completed}</div>
            </div>
            <div className="flex justify-end">
              <Button square variant="secondary">
                <MdKeyboardArrowRight size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="display-2">{strings.theProposalLifecycle}</div>
      <div className="body-1 m-4">{strings.proposalLifecycleDescription}</div>
      <img className="mb-30 mt-2 rounded-xl" src={proposalLifecycleImg} />
    </div>
  )
}
