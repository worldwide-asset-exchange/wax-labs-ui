import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineAdd } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Link } from '@/components/Link';
import { Proposal } from '@/components/Proposal';
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

  useEffect(() => {
    console.debug('Fetch...');
    console.debug(methods.getValues());
  }, [methods, methods.formState.submitCount]);

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
        <Proposal.List>
          {[1, 2, 3, 4].map(proposal => (
            <Proposal.Item
              key={proposal}
              title="PFP Project Generator"
              shortDescription="We're developing a free to use PFP generator. Users will be able to create rules that define their PFP project."
              status={ProposalStatus.COMPLETE}
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
    </FormProvider>
  );
}
