import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { FilterModal } from '@/components/FilterModal';
import { FilterModalRootRef } from '@/components/FilterModal/FilterModalRootRef';
import { ToggleField } from '@/components/ToggleField';
import { proposalStatus } from '@/resources/proposalStatus';

export function ProposalFilterStatus() {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const modalRef = useRef<FilterModalRootRef>(null);

  const { getValues, handleSubmit, register, setValue } = useFormContext();

  function onSubmit({ status }: { status?: string[] }) {
    if (!status) return;

    const newParams = new URLSearchParams(searchParams);

    if (status?.length > 0) {
      newParams.set('status', status.join(','));
    } else {
      newParams.delete('status');
    }

    setSearchParams(newParams);
    modalRef.current?.onClose();
  }

  function handleResetField() {
    searchParams.delete('status');
    setValue('status', []);
  }

  return (
    <FilterModal.Root ref={modalRef}>
      <FilterModal.Trigger>
        <Button active={getValues('status').length > 0}>
          {t('status')}
          {getValues('status').length > 0 ? (
            <span className="label-1 rounded-full bg-accent px-2 text-ui-element">{getValues('status').length}</span>
          ) : (
            <MdOutlineKeyboardArrowDown size={24} />
          )}
        </Button>
      </FilterModal.Trigger>
      <FilterModal.Content title={t('status')}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="grid grid-cols-2 gap-1 p-4">
            {Object.entries(proposalStatus).map(([statusKey, statusValue]) => (
              <ToggleField
                key={statusKey}
                {...register('status')}
                type="checkbox"
                label={statusValue}
                value={statusValue}
              />
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
