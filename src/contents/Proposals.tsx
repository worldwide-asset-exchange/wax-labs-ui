import { useQueries } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineAdd } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { configData, inReviewProposals } from '@/api/chain/proposals';
import { Header } from '@/components/Header';
import { Link } from '@/components/Link';
import * as Proposal from '@/components/Proposal';
import { ProposalFilterWhose } from '@/components/Proposal/components/ProposalFilterWhose';
import { ProposalStatus } from '@/constants.ts';

export function Proposals() {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

  const methods = useForm({
    defaultValues: {
      search: searchParams.get('search') ?? '',
      whose: searchParams.get('whose') ?? t('allProposals'),
      categories: searchParams.get('categories')?.split(',') ?? [],
      status: searchParams.get('status')?.split(',') ?? [],
      sortBy: searchParams.get('sortBy') ?? 'Created last',
    },
  });

  const status = methods.getValues('status');

  const [proposalsQuery, configsQuery] = useQueries({
    queries: [
      {
        queryKey: ['proposals', status.join(',')],
        queryFn: () => {
          return inReviewProposals().then(response => response);
        },
      },
      {
        queryKey: ['configs'],
        queryFn: () => configData().then(response => response),
      },
    ],
  });

  const { isLoading: isLoadingProposals, data: proposals } = proposalsQuery;
  const { isLoading: isLoadingConfigs, data: configs } = configsQuery;

  return (
    <FormProvider {...methods}>
      <Header.Root>
        <Header.Content>
          <ProposalFilterWhose>
            <Header.Button>{methods.getValues('whose')}</Header.Button>
          </ProposalFilterWhose>
        </Header.Content>
        <Header.Action>
          <Link variant="primary" to="create">
            <MdOutlineAdd size={24} className="md:hidden" />
            <span className="max-md:hidden">{t('createProposal')}</span>
          </Link>
        </Header.Action>
      </Header.Root>

      <Proposal.Root>
        {isLoadingProposals || isLoadingConfigs ? (
          <Proposal.List>
            {[...Array(6).keys()].map(item => (
              <Proposal.ItemSkeleton key={item} />
            ))}
          </Proposal.List>
        ) : (
          <Proposal.List>
            {proposals?.map(proposal => (
              <Proposal.Item
                key={proposal.proposal_id}
                title={proposal.title}
                shortDescription={proposal.description}
                status={ProposalStatus.COMPLETE}
                deliverables={`${proposal.deliverables} deliverables`}
                id={proposal.proposal_id}
                requestedAmount="45,000 USD"
                proposer={proposal.proposer}
                category={configs?.categories[Number(proposal.category)] ?? ''}
                lastUpdate={format(new Date(proposal.update_ts), 'LLL Mo, uuuu')}
              />
            ))}
          </Proposal.List>
        )}
        {/* <Proposal.Footer>
          <Button>{t('loadMore')}</Button>
        </Proposal.Footer> */}
      </Proposal.Root>
    </FormProvider>
  );
}
