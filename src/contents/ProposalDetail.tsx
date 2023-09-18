import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineArticle, MdOutlineInfo, MdOutlinePerson, MdOutlinePlaylistAddCheck } from 'react-icons/md';
import { Link as LinkRouter, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { proposalContentData, proposalStatusComment, singleProposal } from '@/api/chain/proposals';
import { Proposal } from '@/api/models/proposal';
import { ActionsBar } from '@/components/AdminBar';
import { Vote } from '@/components/AdminBar/proposalStates/Vote.tsx';
import { ProposalDetailDeliverables } from '@/components/ProposalDetail/ProposalDetailDeliverables';
import { ProposalDetailDetail } from '@/components/ProposalDetail/ProposalDetailDetail';
import { ProposalDetailOverview } from '@/components/ProposalDetail/ProposalDetailOverview';
import { ProposalDetailProposer } from '@/components/ProposalDetail/ProposalDetailProposer';
import { StatusTag } from '@/components/StatusTag';
import * as Tabs from '@/components/Tabs';
import { ProposalStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useIsAdmin } from '@/hooks/useIsAdmin.ts';
import { useToast } from '@/hooks/useToast.ts';
import { imageExists } from '@/utils/image';
import { toProposalStatus } from '@/utils/proposalUtils';

export function ProposalDetail() {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStatus, setCurrentStatus] = useState<ProposalStatusKey | null>(null);

  const tabParam = useMemo(() => searchParams.get('tab'), [searchParams]);
  const params = useParams();
  const proposalId = Number(params.proposalId);
  const { actor } = useChain();
  const isAdmin = useIsAdmin();
  const { toast } = useToast();

  const {
    data: proposal,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: async () => {
      const [proposalData, contentData, comments] = await Promise.all([
        singleProposal({ proposalId }),
        proposalContentData({ proposalId }),
        proposalStatusComment({ proposalId }),
      ]);

      if (!proposalData) {
        toast({ description: t('proposalNotFound'), variant: 'error' });
        navigate('/proposals');
        return Promise.reject(t('proposalNotFound'));
      }

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
        statusComment: comments?.status_comment ?? '',
      } as Proposal & { content: string; statusComment: string };
    },
    enabled: !!proposalId,
  });

  const onProposalChanged = (status: ProposalStatusKey) => {
    setCurrentStatus(status);
    void refetch();
  };

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
      {(actor === proposal.proposer || isAdmin) && (
        <div className="bg-subtle">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <div className="flex-none">
              <StatusTag status={toProposalStatus(currentStatus ?? proposal.status)} />
            </div>
            <div className="flex-none">
              <ActionsBar proposal={proposal} onChange={onProposalChanged} />
            </div>
          </div>
        </div>
      )}
      {actor !== proposal.proposer && proposal.status === ProposalStatusKey.VOTING_OR_ACCEPTED && (
        <div className="bg-subtle">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <div className="flex-none">
              <Vote proposal={proposal} />
            </div>
          </div>
        </div>
      )}
      <header className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <h1 className="display-1 text-high-contrast">{proposal.title}</h1>
        <p className="subtitle-1 text-low-contrast">{proposal.description}</p>
        {proposal.statusComment && (
          <>
            <h3 className="title-3 text-accent">{t('latestStatusComment')}</h3>
            <p
              className="subtitle-1 text-low-contrast"
              dangerouslySetInnerHTML={{
                __html: proposal.statusComment,
              }}
            />
          </>
        )}
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
