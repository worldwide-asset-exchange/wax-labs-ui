import { useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineAdd } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { inReviewProposals } from '@/api/chain/proposals';
import { Header } from '@/components/Header';
import { Link } from '@/components/Link';
import * as Proposal from '@/components/Proposal';
import { ProposalFilterWhose } from '@/components/Proposal/components/ProposalFilterWhose';

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

  const { isLoading, data: proposals } = useQuery({
    queryKey: ['proposals', status.join(',')],
    queryFn: () => {
      return inReviewProposals().then(response => response);
    },
  });

  return (
    <FormProvider {...methods}>
      <Header.Root>
        <Header.Content>
          <ProposalFilterWhose>
            <Header.Button>{methods.getValues('whose')}</Header.Button>
          </ProposalFilterWhose>
        </Header.Content>
        <Header.Action>
          <Link variant="primary" to="/create-proposal">
            <MdOutlineAdd size={24} className="md:hidden" />
            <span className="max-md:hidden">{t('createProposal')}</span>
          </Link>
        </Header.Action>
      </Header.Root>

      <Proposal.Root>
        {isLoading ? (
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
                // status={proposal.status}
                deliverables={proposal.deliverables}
                id={proposal.proposal_id}
                requestedAmount={proposal.total_requested_funds}
                proposer={proposal.proposer}
                category={proposal.category}
                lastUpdate={proposal.update_ts}
              />
            ))}
          </Proposal.List>
        )}
      </Proposal.Root>
    </FormProvider>
  );
}
