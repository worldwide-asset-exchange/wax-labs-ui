import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import * as FilterModal from '@/components/FilterModal';
import { FilterModalRootRef } from '@/components/FilterModal/FilterModalRootRef';
import { ToggleField } from '@/components/ToggleField';
import { sortByMapping } from '@/mappings/sortByMapping.ts';

export function ProposalFilterSortBy({ onChangeFilters }: { onChangeFilters: () => void }) {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const modalRef = useRef<FilterModalRootRef>(null);

  const { getValues, handleSubmit, register } = useFormContext();

  function onSubmit({ sortBy }: { sortBy?: string }) {
    const newParams = new URLSearchParams(searchParams);

    if (sortBy && getValues('sortBy') !== 'Created last') {
      newParams.set('sortBy', sortBy);
    } else {
      newParams.delete('sortBy');
    }

    setSearchParams(newParams);
    modalRef.current?.onClose();
    onChangeFilters();
  }

  return (
    <FilterModal.Root ref={modalRef}>
      <FilterModal.Trigger>
        <Button>
          {getValues('sortBy')}
          <MdOutlineKeyboardArrowDown size={24} />
        </Button>
      </FilterModal.Trigger>
      <FilterModal.Content title={t('sortBy')}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="flex flex-col gap-1 p-4">
            {Object.keys(sortByMapping()).map(sortBy => (
              <ToggleField {...register('sortBy')} key={sortBy} type="radio" label={sortBy} value={sortBy} />
            ))}
          </fieldset>
          <footer className="flex items-center justify-end p-4">
            <Button variant="primary" type="submit">
              {t('apply')}
            </Button>
          </footer>
        </form>
      </FilterModal.Content>
    </FilterModal.Root>
  );
}
