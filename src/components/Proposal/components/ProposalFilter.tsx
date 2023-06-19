import { ChangeEvent, RefObject, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineFilterList, MdOutlineSearch, MdOutlineViewColumn, MdOutlineViewList } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { debounce } from '@/resources/debounce';

import { ProposalFilterCategories } from './ProposalFilterCategories';
import { ProposalFilterSortBy } from './ProposalFilterSortBy';
import { ProposalFilterStatus } from './ProposalFilterStatus';

export function ProposalFilter() {
  const { t } = useTranslation();
  const filterBarRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { getValues, register } = useFormContext();

  function handleSearchTerm(event: ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (search) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }

    setSearchParams(newParams);
  }

  function handleToggleShowSearchField() {
    const element = filterBarRef.current;
    if (element) {
      element.dataset.searchField = element.dataset.searchField === 'visible' ? 'hidden' : 'visible';
    }
  }

  function handleToggleView() {
    const parentElement = filterBarRef.current?.parentNode as HTMLDivElement;

    if (!parentElement) return;

    const isGrid = parentElement.dataset.view === 'grid';
    const value = isGrid ? 'list' : 'grid';

    localStorage.setItem('@WaxLabs:v1:proposal-view', value);
    parentElement.dataset.view = value;
  }

  return (
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
          <Input
            {...register('search', {
              onChange: debounce(handleSearchTerm),
            })}
            placeholder={t('searchPlaceholder') as string}
          >
            <MdOutlineSearch size={24} />
          </Input>
        </div>
      </div>
      <div className="flex-none lg:hidden group-data-[search-field=visible]/filter-bar:max-lg:hidden">
        <Button onClick={handleToggleShowSearchField} square active={getValues('search').length > 0}>
          <MdOutlineSearch size={24} />
        </Button>
      </div>
      <div className="flex-none group-data-[search-field=visible]/filter-bar:max-lg:hidden">
        <ProposalFilterCategories />
      </div>
      <div className="flex-none group-data-[search-field=visible]/filter-bar:max-lg:hidden">
        <ProposalFilterStatus />
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
        <ProposalFilterSortBy />
      </div>
    </div>
  );
}
