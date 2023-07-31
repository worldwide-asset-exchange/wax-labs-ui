import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineAdd } from 'react-icons/md';
import { Navigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/Button.tsx';
import * as Header from '@/components/Header';
import { Link } from '@/components/Link';
import * as ProposalModule from '@/components/Proposal';
import { ProposalFilterWhose } from '@/components/Proposal/components/ProposalFilterWhose';
import { Whose } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useConfigData } from '@/hooks/useConfigData.ts';
import { ProposalSearchForm, useProposalFilter } from '@/hooks/useProposalFilter.ts';
import { whoseFilterMapping } from '@/mappings/whoseFilterMapping.ts';

const DEFAULT_PAGE_SLICE = 15;

export function Proposals({ actAsActor }: { actAsActor?: string }) {
  const { isAdmin } = useConfigData();
  const { isAuthenticated } = useChain();
  const { t } = useTranslation();
  const [pageSlice, setPageSlice] = useState(DEFAULT_PAGE_SLICE);

  const [searchParams] = useSearchParams();

  const methods = useForm<ProposalSearchForm>({
    defaultValues: {
      search: searchParams.get('search') ?? '',
      whose: searchParams.get('whose') ?? t('allProposals'),
      categories: searchParams.get('categories')?.split(',') ?? [],
      status: searchParams.get('status')?.split(',') ?? [],
      sortBy: searchParams.get('sortBy') ?? 'Created last',
    },
  });
  const { proposals, isLoading } = useProposalFilter({
    sortBy: methods.getValues('sortBy'),
    search: methods.getValues('search'),
    status: methods.getValues('status'),
    whose: methods.getValues('whose'),
    categories: methods.getValues('categories'),
    actAsActor,
  });
  const proposalSlice = proposals.slice(0, pageSlice);
  const totalProposals = proposals.length;

  const whoseKey = methods.getValues('whose') ? whoseFilterMapping()[methods.getValues('whose') as string] : null;
  const showStaticWhose = !!actAsActor || isAuthenticated !== true;

  if (
    actAsActor == null &&
    ((whoseKey === Whose.MY_PROPOSALS && isAuthenticated !== true) ||
      (whoseKey === Whose.PROPOSALS_TO_REVIEW && isAdmin !== true))
  ) {
    return <Navigate to="/" />;
  }

  return (
    <FormProvider {...methods}>
      <Header.Root>
        <Header.Content>
          {showStaticWhose ? (
            <h2 className="title-2 text-high-contrast">{actAsActor ? t('myProposals') : methods.getValues('whose')}</h2>
          ) : (
            <ProposalFilterWhose>
              <Header.Button>{methods.getValues('whose')}</Header.Button>
            </ProposalFilterWhose>
          )}
        </Header.Content>
        {isAuthenticated && (
          <Header.Action>
            <Link variant="primary" to="create">
              <MdOutlineAdd size={24} className="md:hidden" />
              <span className="max-md:hidden">{t('createProposal')}</span>
            </Link>
          </Header.Action>
        )}
      </Header.Root>

      <ProposalModule.Root onChangeFilters={() => setPageSlice(DEFAULT_PAGE_SLICE)}>
        {isLoading ? (
          <ProposalModule.List>
            {[...Array(6).keys()].map(item => (
              <ProposalModule.ItemSkeleton key={item} />
            ))}
          </ProposalModule.List>
        ) : (
          <>
            <ProposalModule.List>
              {proposalSlice?.length > 0 ? (
                proposalSlice.map(proposal => (
                  <ProposalModule.Item
                    key={proposal.proposal_id.toString()}
                    title={proposal.title}
                    shortDescription={proposal.description}
                    status={proposal.status}
                    deliverables={proposal.deliverables}
                    id={proposal.proposal_id}
                    requestedAmount={proposal.total_requested_funds}
                    proposer={proposal.proposer}
                    category={proposal.category}
                    lastUpdate={proposal.update_ts}
                  />
                ))
              ) : (
                <h2 className="title-2 py-8 text-center text-high-contrast">{t('noProposalsFound')}</h2>
              )}
            </ProposalModule.List>
            {totalProposals > pageSlice && (
              <div className="flex justify-center pt-3">
                <Button variant="primary" onClick={() => setPageSlice(prevState => prevState + DEFAULT_PAGE_SLICE)}>
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </>
        )}
      </ProposalModule.Root>
    </FormProvider>
  );
}
