import { ReactNode, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import * as FilterModal from '@/components/FilterModal';
import { FilterModalRootRef } from '@/components/FilterModal/FilterModalRootRef';
import { ToggleField } from '@/components/ToggleField';
import { useChain } from '@/hooks/useChain.ts';
import { useConfigData } from '@/hooks/useConfigData.ts';

interface ProposalFilterWhoseProps {
  children: ReactNode;
}

export function ProposalFilterWhose({ children }: ProposalFilterWhoseProps) {
  const { isAdmin } = useConfigData();
  const { isAuthenticated } = useChain();
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const modalRef = useRef<FilterModalRootRef>(null);

  const { getValues, handleSubmit, register } = useFormContext();

  function onSubmit({ whose }: { whose?: string }) {
    const newParams = new URLSearchParams(searchParams);

    if (whose && getValues('whose') !== t('allProposals')) {
      newParams.set('whose', whose);
    } else {
      newParams.delete('whose');
    }

    setSearchParams(newParams);

    modalRef.current?.onClose();
  }

  return (
    <FilterModal.Root ref={modalRef}>
      <FilterModal.Trigger>{children}</FilterModal.Trigger>
      <FilterModal.Content title={getValues('whose')}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="flex flex-col gap-1 p-4">
            <ToggleField
              {...register('whose')}
              type="radio"
              label={t('allProposals')}
              value={t('allProposals') as string}
            />
            {isAuthenticated && (
              <ToggleField
                {...register('whose')}
                type="radio"
                label={t('myProposals')}
                value={t('myProposals') as string}
              />
            )}
            {isAdmin && (
              <ToggleField
                {...register('whose')}
                type="radio"
                label={t('proposalsToReview')}
                value={t('proposalsToReview') as string}
              />
            )}
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
