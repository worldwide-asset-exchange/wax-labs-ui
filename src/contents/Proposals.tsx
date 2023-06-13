import { RefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdOutlineAdd,
  MdOutlineFilterList,
  MdOutlineKeyboardArrowDown,
  MdOutlineSearch,
  MdOutlineViewColumn,
  MdOutlineViewList,
} from 'react-icons/md';

import { Button } from '@/components/Button';
import { FilterModal } from '@/components/FilterModal';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Link } from '@/components/Link';
import { Proposal } from '@/components/Proposal';
import { ProposalStatus } from '@/constants.ts';
import { toggleView } from '@/components/Proposal/proposalView';
import { ToggleField } from '@/components/ToggleField';

export function Proposals() {
  const filterBarRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const proposalRootRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  function handleToggleView() {
    const proposalRootElement = proposalRootRef.current;

    if (!proposalRootElement) return;

    toggleView(proposalRootElement);
  }

  function handleToggleShowSearchField() {
    const element = filterBarRef.current;
    if (element) {
      element.dataset.searchField = element.dataset.searchField === 'visible' ? 'hidden' : 'visible';
    }
  }

  return (
    <>
      <Header.Root>
        <Header.Content>
          <FilterModal.Root>
            <FilterModal.Trigger>
              <Header.Button>{t('allProposals')}</Header.Button>
            </FilterModal.Trigger>
            <FilterModal.Content title={t('allProposals')}>
              <form action="">
                <fieldset className="flex flex-col gap-1 p-4">
                  <ToggleField name="whoseProposal" type="radio" label="All proposals" />
                  <ToggleField name="whoseProposal" type="radio" label="My proposals" />
                  <ToggleField name="whoseProposal" type="radio" label="Proposals to review" />
                </fieldset>
                <footer className="flex items-center justify-end p-4">
                  <Button variant="primary" type="submit">
                    Apply
                  </Button>
                </footer>
              </form>
            </FilterModal.Content>
          </FilterModal.Root>
        </Header.Content>
        <Header.Action>
          <Link variant="primary" to="create">
            <MdOutlineAdd size={24} className="md:hidden" />
            <span className="max-md:hidden">{t('createProposal')}</span>
          </Link>
        </Header.Action>
      </Header.Root>

      <Proposal.Root ref={proposalRootRef}>
        <div
          data-search-field="hidden"
          ref={filterBarRef}
          className="group/filter-bar relative mx-auto flex max-w-7xl gap-4 px-4 max-md:w-full data-[search-field=hidden]:max-md:overflow-x-auto"
        >
          <div className="flex flex-1 gap-4 group-data-[search-field=hidden]/filter-bar:max-lg:hidden">
            <div className="flex-none lg:hidden">
              <Button onClick={handleToggleShowSearchField} square>
                <MdOutlineFilterList size={24} />
              </Button>
            </div>
            <div className="flex-1">
              <Input placeholder="Search by name, description and proposer's account">
                <MdOutlineSearch size={24} />
              </Input>
            </div>
          </div>
          <div className="flex-none lg:hidden group-data-[search-field=visible]/filter-bar:max-lg:hidden">
            <Button onClick={handleToggleShowSearchField} square>
              <MdOutlineSearch size={24} />
            </Button>
          </div>
          <div className="flex-none group-data-[search-field=visible]/filter-bar:max-lg:hidden">
            <FilterModal.Root>
              <FilterModal.Trigger>
                <Button active>
                  {t('categories')}
                  <span className="label-1 rounded-full bg-accent px-2 text-ui-element">1</span>
                </Button>
              </FilterModal.Trigger>
              <FilterModal.Content title={t('categories')}>
                <form action="">
                  <fieldset className="flex flex-col gap-1 p-4">
                    <ToggleField type="checkbox" label="marketing" />
                    <ToggleField type="checkbox" label="infra.tools" />
                    <ToggleField type="checkbox" label="dev.tools" />
                    <ToggleField type="checkbox" label="governance" />
                    <ToggleField type="checkbox" label="other" />
                  </fieldset>
                  <footer className="flex items-center justify-between p-4">
                    <Button variant="tertiary">Clean</Button>
                    <Button variant="primary" type="submit">
                      Apply
                    </Button>
                  </footer>
                </form>
              </FilterModal.Content>
            </FilterModal.Root>
          </div>
          <div className="flex-none group-data-[search-field=visible]/filter-bar:max-lg:hidden">
            <FilterModal.Root>
              <FilterModal.Trigger>
                <Button>
                  {t('status')}
                  <MdOutlineKeyboardArrowDown size={24} />
                </Button>
              </FilterModal.Trigger>
              <FilterModal.Content title={t('status')}>
                <form action="">
                  <fieldset className="grid grid-cols-2 gap-1 p-4">
                    {Object.entries(proposalStatus).map(([statusKey, statusValue]) => (
                      <ToggleField key={statusKey} type="checkbox" label={statusValue} />
                    ))}
                  </fieldset>
                  <footer className="flex items-center justify-between p-4">
                    <Button variant="tertiary">Clean</Button>
                    <Button variant="primary" type="submit">
                      Apply
                    </Button>
                  </footer>
                </form>
              </FilterModal.Content>
            </FilterModal.Root>
          </div>
          <div className="flex-none max-md:hidden group-data-[search-field=visible]/filter-bar:max-lg:hidden">
            <Button onClick={handleToggleView} square>
              <div className="group/view flex gap-4">
                <div className="group-data-[view=grid]/proposal-root:text-accent">
                  <MdOutlineViewColumn size={24} />
                </div>
                <div className="group-data-[view=list]/proposal-root:text-accent">
                  <MdOutlineViewList size={24} />
                </div>
              </div>
            </Button>
          </div>
          <div className="flex-none group-data-[search-field=visible]/filter-bar:max-lg:hidden">
            <FilterModal.Root>
              <FilterModal.Trigger>
                <Button>
                  {t('createdLast')}
                  <MdOutlineKeyboardArrowDown size={24} />
                </Button>
              </FilterModal.Trigger>
              <FilterModal.Content title={t('sortBy')}>
                <form action="">
                  <fieldset className="flex flex-col gap-1 p-4">
                    <ToggleField name="sortBy" type="radio" label="Created last" />
                    <ToggleField name="sortBy" type="radio" label="Created first" />
                    <ToggleField name="sortBy" type="radio" label="Lowest Wax amount requested" />
                    <ToggleField name="sortBy" type="radio" label="Highest Wax amount requested" />
                    <ToggleField name="sortBy" type="radio" label="Last updated" />
                  </fieldset>
                  <footer className="flex items-center justify-end p-4">
                    <Button variant="primary" type="submit">
                      Apply
                    </Button>
                  </footer>
                </form>
              </FilterModal.Content>
            </FilterModal.Root>
          </div>
        </div>

        <Proposal.List>
          {[1, 2, 3, 4].map(proposal => (
            <Proposal.Item
              key={proposal}
              title="PFP Project Generator"
              shortDescription="We're developing a free to use PFP generator. Users will be able to create rules that define their PFP project."
              status={proposalStatus.COMPLETE}
              deliverables="3 deliverables"
              id="523"
              requestedAmount="45,000 USD"
              proposer="hyogasereiou"
              category="other"
              lastUpdate="Jan 10th, 2023"
            />
          ))}
        </Proposal.List>
        <Proposal.Footer>
          <Button>{t('loadMore')}</Button>
        </Proposal.Footer>
      </Proposal.Root>
    </>
  );
}
