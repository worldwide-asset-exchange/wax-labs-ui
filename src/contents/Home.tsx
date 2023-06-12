import { useEffect, useState } from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'

import proposalLifecycleImg from '@/assets/proposal-lifecycle.png'
import { Button } from '@/components/Button'
import { proposalStatus } from '@/resources/proposalStatus'
import strings from '@/resources/strings'

const mockedStats = {
  inReview: 2,
  inVoting: 0,
  inProgress: 14,
  completed: 28,
  operationalFunds: 689210,
  additionalFunds: 159469353.65
}

export function Home() {
  const [stats, setStats] = useState(mockedStats)

  useEffect(() => {
    setStats(mockedStats)
  }, [])

  return (
    <>
      <header className="mx-auto my-44 flex max-w-[832px] flex-col items-center justify-center px-4 text-center">
        <h1 className="display-1 mb-8 text-high-contrast">{strings.homeTitle}</h1>
        <Button variant="primary">{strings.seeProposals}</Button>
      </header>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-1 px-1 text-high-contrast md:grid-cols-4 md:grid-rows-4 md:px-4">
        <div className="order-1 col-span-2 rounded-xl bg-subtle p-12 md:order-none md:row-span-2">
          <h2 className="title-2">{strings.homeDescription}</h2>
        </div>
        <div className="order-4 col-span-1 flex flex-col justify-between rounded-xl bg-[#212C59] p-12 text-[#899CF8] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{stats.inReview}</h2>
            <h3 className="label-2 mt-1">{proposalStatus.REVIEW}</h3>
          </div>
          <div className="flex justify-end">
            <Button square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Button>
          </div>
        </div>
        <div className="order-5 col-span-1 flex flex-col justify-between gap-2 rounded-xl bg-[#4A250D] p-12 text-[#F09150] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{stats.inVoting}</h2>
            <h3 className="label-2 m-1">{proposalStatus.VOTING}</h3>
          </div>
          <div className="flex justify-end">
            <Button square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Button>
          </div>
        </div>
        <div className="order-2 col-span-2 rounded-xl bg-subtle p-12 md:order-none md:row-span-1">
          <h2 className="label-2 mb-1">{strings.operationalFunds}</h2>
          <p className="title-2">
            {stats.operationalFunds.toLocaleString('en-US', { minimumFractionDigits: 2 })} {strings.wax}
          </p>
        </div>
        <div className="order-6 col-span-1 flex flex-col justify-between gap-2 rounded-xl bg-[#3F2353] p-12 text-[#B57DE9] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{stats.inProgress}</h2>
            <h3 className="label-2 mt-1">{proposalStatus.PROGRESS}</h3>
          </div>
          <div className="flex justify-end">
            <Button square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Button>
          </div>
        </div>
        <div className="order-7 col-span-1 flex flex-col justify-between gap-2 rounded-xl bg-[#213824] p-12 text-[#7BBF7C] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{stats.completed}</h2>
            <h3 className="label-2 mt-1">{proposalStatus.COMPLETE}</h3>
          </div>
          <div className="flex justify-end">
            <Button square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Button>
          </div>
        </div>
        <div className="order-3 col-span-2 rounded-xl bg-subtle p-12 md:order-none md:row-span-1">
          <h2 className="label-2 mb-1">{strings.additionalFunds}</h2>
          <p className="title-2">
            {stats.additionalFunds.toLocaleString('en-US', { minimumFractionDigits: 2 })} {strings.wax}
          </p>
        </div>
      </div>
      <div className="mt-44 flex flex-col items-center justify-center px-4 text-center text-high-contrast">
        <h2 className="display-2">{strings.theProposalLifecycle}</h2>
        <p className="body-1 m-4">{strings.proposalLifecycleDescription}</p>
        <img className="mb-30 mt-2 rounded-xl" src={proposalLifecycleImg} />
      </div>
    </>
  )
}
