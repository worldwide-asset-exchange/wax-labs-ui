import { useState } from 'react'
import { MdKeyboardArrowDown, MdSearch } from 'react-icons/md'

import { Button } from '@/components/Button'
import { Header } from '@/components/Header'
import { Input } from '@/components/Input'
import { Proposal } from '@/components/Proposal'

export function Proposals() {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  function handleOnClick() {
    setView((state) => (state === 'grid' ? 'list' : 'grid'))
  }

  return (
    <>
      <Header.Root>
        <Header.Content>
          <Header.Button
            onClick={() => {
              console.log('click')
            }}
          >
            All Proposals
          </Header.Button>
        </Header.Content>
        <Header.Action>
          <Button variant="primary">Create proposal</Button>
        </Header.Action>
      </Header.Root>

      <div className="mx-auto flex max-w-7xl gap-4 px-4 pb-4">
        <div className="flex-1">
          <Input placeholder="Search by name, description and proposer's account">
            <MdSearch size={24} />
          </Input>
        </div>
        <div className="flex-none">
          <Button active>
            Categories
            <span className="label-1 rounded-full bg-accent px-2 text-ui-element">1</span>
          </Button>
        </div>
        <div className="flex-none">
          <Button>
            Status
            <MdKeyboardArrowDown size={24} />
          </Button>
        </div>
        <div className="flex-none">
          <Button onClick={handleOnClick}>Grid / List</Button>
        </div>
        <div className="flex-none">
          <Button>
            Created last
            <MdKeyboardArrowDown size={24} />
          </Button>
        </div>
      </div>

      <Proposal.List view={view}>
        {[1, 2, 3, 4].map((proposal) => (
          <Proposal.Item
            key={proposal}
            title="PFP Project Generator"
            shortDescription="We're developing a free to use PFP generator. Users will be able to create rules that define their PFP project."
            status="completed"
            deliverables="3 deliverables"
            id="523"
            requestedAmount="45,000 USD"
            proposer="hyogasereiou"
            category="other"
            lastUpdate="Jan 10th, 2023"
          />
        ))}
      </Proposal.List>

      <div className="flex justify-center p-8">
        <Button>Load More</Button>
      </div>
    </>
  )
}
