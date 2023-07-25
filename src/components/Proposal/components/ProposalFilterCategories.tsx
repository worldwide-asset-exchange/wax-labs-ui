import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import * as FilterModal from '@/components/FilterModal';
import { FilterModalRootRef } from '@/components/FilterModal/FilterModalRootRef';
import { ToggleField } from '@/components/ToggleField';
import { useConfig } from '@/hooks/useConfig';

export function ProposalFilterCategories() {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const modalRef = useRef<FilterModalRootRef>(null);

  const { getValues, handleSubmit, register, setValue } = useFormContext();

  const { config } = useConfig();

  function onSubmit({ categories }: { categories?: string[] }) {
    if (!categories) return;

    const newParams = new URLSearchParams(searchParams);

    if (categories.length > 0) {
      newParams.set('categories', categories.join(','));
    } else {
      newParams.delete('categories');
    }

    setSearchParams(newParams);
    modalRef.current?.onClose();
  }

  function handleResetField() {
    searchParams.delete('categories');
    setValue('categories', []);
  }

  return (
    <FilterModal.Root ref={modalRef}>
      <FilterModal.Trigger>
        <Button active={getValues('categories').length > 0}>
          {t('categories')}
          {getValues('categories').length > 0 ? (
            <span className="label-1 rounded-full bg-accent px-2 text-ui-element">
              {getValues('categories').length}
            </span>
          ) : (
            <MdOutlineKeyboardArrowDown size={24} />
          )}
        </Button>
      </FilterModal.Trigger>
      <FilterModal.Content title={t('categories')}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="flex flex-col gap-1 p-4">
            {config?.categories.map((category, index) => (
              <ToggleField {...register('categories')} key={category} type="checkbox" label={category} value={index} />
            ))}
          </fieldset>
          <footer className="flex items-center justify-between p-4">
            <Button variant="tertiary" onClick={handleResetField}>
              {t('clean')}
            </Button>
            <Button variant="primary" type="submit">
              {t('apply')}
            </Button>
          </footer>
        </form>
      </FilterModal.Content>
    </FilterModal.Root>
  );
}
