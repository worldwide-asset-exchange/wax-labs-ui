import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineArticle, MdOutlineInfo, MdOutlinePerson, MdOutlinePlaylistAddCheck } from 'react-icons/md';
import { Link as LinkRouter, Navigate, useParams, useSearchParams } from 'react-router-dom';

import { proposalContentData, singleProposal } from '@/api/chain/proposals';
import { Proposal } from '@/api/models/proposal';
import { Link } from '@/components/Link';
import { ProposalDetailDeliverables } from '@/components/ProposalDetail/ProposalDetailDeliverables';
import { ProposalDetailDetail } from '@/components/ProposalDetail/ProposalDetailDetail';
import { ProposalDetailOverview } from '@/components/ProposalDetail/ProposalDetailOverview';
import { ProposalDetailProposer } from '@/components/ProposalDetail/ProposalDetailProposer';
import { StatusTag } from '@/components/StatusTag';
import * as Tabs from '@/components/Tabs';
import { ProposalStatusKey } from '@/constants';
import { useChain } from '@/hooks/useChain.ts';
import { imageExists } from '@/utils/image';
import { toProposalStatus } from '@/utils/proposalUtils';

export function ProposalDetail() {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

  const tabParam = useMemo(() => searchParams.get('tab'), [searchParams]);
  const params = useParams();
  const proposalId = Number(params.proposalId);
  const { actor } = useChain();

  const {
    data: proposal,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: async () => {
      const [proposalData, contentData] = await Promise.all([
        singleProposal({ proposalId }),
        proposalContentData({ proposalId }),
      ]);

      if (proposalData?.image_url) {
        try {
          await imageExists(proposalData.image_url);
        } catch (e) {
          proposalData.image_url = '';
        }
      }

      return {
        ...proposalData,
        content: contentData?.content ?? '',
      } as Proposal & { content: string };
    },
    enabled: !!proposalId,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 duration-150">
        <div className="h-14 w-full rounded-md bg-ui-element" />
        <div className="mb-3 mt-[2.375rem] h-5  w-full rounded-md bg-ui-element" />
        <div className="mb-[2.375rem] h-5 w-3/4 rounded-md bg-ui-element" />
        <div className="flex gap-1 border-b border-subtle-light">
          <div className="flex gap-3 p-3">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-28 rounded-md bg-ui-element" />
          </div>
          <div className="flex gap-3 p-3">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-28 rounded-md bg-ui-element" />
          </div>
          <div className="flex gap-3 p-3">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-28 rounded-md bg-ui-element" />
          </div>
        </div>
        <div className="mt-16 h-7 w-28 rounded-md bg-ui-element" />
        <div className="mt-8 h-[32rem] rounded-xl bg-ui-element" />
      </div>
    );
  }

  if (!isSuccess || !proposal) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {actor === proposal.proposer && (
        <div className="bg-subtle">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <div className="flex-none">
              <StatusTag status={toProposalStatus(proposal.status)} />
            </div>
            <div className="flex-none">
              {proposal.status === ProposalStatusKey.DRAFTING && (
                <Link to="edit?step=1" variant="primary">
                  {t('edit')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      <header className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <h1 className="display-1 text-high-contrast">{proposal.title}</h1>
        <p className="subtitle-1 text-low-contrast">{proposal.description}</p>
      </header>
      <Tabs.Root smallSize>
        <LinkRouter to="?tab=overview">
          <Tabs.Item active={!tabParam || tabParam === 'overview'}>
            <MdOutlineArticle size={24} />
            {t('overview')}
          </Tabs.Item>
        </LinkRouter>
        <LinkRouter to="?tab=deliverables">
          <Tabs.Item active={tabParam === 'deliverables'}>
            <MdOutlinePlaylistAddCheck size={24} />
            {t('deliverables')}
          </Tabs.Item>
        </LinkRouter>
        <LinkRouter to="?tab=proposer">
          <Tabs.Item active={tabParam === 'proposer'}>
            <MdOutlinePerson size={24} />
            {t('proposer')}
          </Tabs.Item>
        </LinkRouter>
        <LinkRouter to="?tab=detail">
          <Tabs.Item active={tabParam === 'detail'}>
            <MdOutlineInfo size={24} />
            {t('detail')}
          </Tabs.Item>
        </LinkRouter>
      </Tabs.Root>

      {tabParam === 'deliverables' && (
        <ProposalDetailDeliverables total={proposal.deliverables} completed={proposal.deliverables_completed} />
      )}

      {tabParam === 'proposer' && <ProposalDetailProposer proposer={proposal.proposer} />}

      {tabParam === 'detail' && (
        <ProposalDetailDetail
          status={proposal.status}
          identifier={proposal.proposal_id}
          totalClaimed="0000"
          reviewer={proposal.reviewer}
          category={proposal.category}
          lastUpdate={proposal.update_ts}
          totalRequested={proposal.total_requested_funds}
        />
      )}

      {(!tabParam || tabParam === 'overview') && (
        <ProposalDetailOverview
          imageURL={proposal.image_url}
          content={proposal.content}
          financialRoadMap={proposal.road_map}
        />
      )}
    </>
  );
}
