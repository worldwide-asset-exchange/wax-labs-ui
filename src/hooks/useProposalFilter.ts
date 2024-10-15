import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { deliverablesWithStatus } from '@/api/chain/deliverables/query/deliverablesWithStatus.ts';
import {
  approvedProposals,
  cancelledProposals,
  completedProposals,
  inDrafting,
  inProgressProposals,
  inReviewProposals,
  inVotingProposals,
} from '@/api/chain/proposals';
import { failedDraftProposals } from '@/api/chain/proposals/query/failedDraftProposals.ts';
import { failedProposals } from '@/api/chain/proposals/query/failedProposals.ts';
import { hasReviewableDeliverables } from '@/api/chain/proposals/query/hasReviewableDeliverables.ts';
import { submittedProposals } from '@/api/chain/proposals/query/submittedProposals.ts';
import { userProposals } from '@/api/chain/proposals/query/userProposals.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { DeliverableStatusKey, ProposalStatusKey, SortBy, Whose } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useConfigData } from '@/hooks/useConfigData.ts';
import { sortByMapping } from '@/mappings/sortByMapping.ts';
import { statusFilterMapping } from '@/mappings/statusFilterMapping.ts';
import { whoseFilterMapping } from '@/mappings/whoseFilterMapping.ts';
import { currencyToFloat } from '@/utils/parser.ts';

export interface ProposalSearchForm {
  search: string;
  whose: string | null;
  categories: string[] | null;
  status: string[] | null;
  sortBy: string | null;
}

interface ProposalFilterReturn {
  isLoading: boolean;
  proposals: Proposal[];
}

const defaultFilterStatus = [
  ProposalStatusKey.DRAFTING,
  ProposalStatusKey.SUBMITTED,
  ProposalStatusKey.APPROVED,
  ProposalStatusKey.VOTING,
  ProposalStatusKey.IN_PROGRESS,
  ProposalStatusKey.FAILED,
  ProposalStatusKey.CANCELLED,
  ProposalStatusKey.FAILED_DRAFT,
];

export type ProposalFilterProps = ProposalSearchForm & { actAsActor?: string };

export function useProposalFilter({
  sortBy,
  search,
  status,
  whose,
  categories,
  actAsActor,
}: ProposalFilterProps): ProposalFilterReturn {
  const { actor, isAuthenticated } = useChain();
  const { isAdmin, configs } = useConfigData();
  const statusKeys = useMemo(() => new Set(status?.map(s => statusFilterMapping()[s]) ?? []), [status]);
  const sortByKey = sortBy ? sortByMapping()[sortBy] : null;
  const categoryKeys = useMemo(
    () => new Set(categories ? categories.map(c => configs?.categories.indexOf(c)) : []),
    [categories, configs?.categories]
  );
  const whoseKey = whose ? whoseFilterMapping()[whose] : null;
  const enabled =
    !(
      (whoseKey === Whose.MY_PROPOSALS && isAuthenticated !== true) ||
      (whoseKey === Whose.PROPOSALS_TO_REVIEW && isAdmin !== true)
    ) && isAuthenticated != null;

  const { isLoading, data } = useQuery({
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryKey: ['proposalsFilter', actor, whoseKey, actAsActor],
    queryFn: async () => {
      let proposals: Proposal[] = [];
      if (whoseKey === Whose.MY_PROPOSALS || actAsActor != null) {
        proposals = await myProposals((actAsActor ?? actor)! as string);
      } else if (whoseKey === Whose.ALL_PROPOSALS) {
        proposals = await allProposals();
      } else if (whoseKey === Whose.DELIVERABLES_TO_REVIEW) {
        proposals = await proposalsWithReviewable();
      } else {
        proposals = await toReviewProposals();
      }

      proposals = proposals ?? [];

      if (whoseKey === Whose.DELIVERABLES_TO_REVIEW) {
        return hasReviewableDeliverables(proposals);
      }

      return proposals;
    },
    enabled,
  });

  return useMemo(() => {
    const proposals = (data ?? [])
      .filter(filterUnique())
      .filter(filterByStatus(statusKeys))
      .filter(filterCategory(categoryKeys))
      .filter(filterByName(search));

    if (sortByKey != null) {
      proposals.sort(sorter(sortByKey));
    }

    return { proposals: proposals ?? [], isLoading };
  }, [categoryKeys, data, isLoading, search, sortByKey, statusKeys]);
}

async function allProposals() {
  const responses = await Promise.all([
    inDrafting(),
    inReviewProposals(),
    approvedProposals(),
    inVotingProposals(),
    inProgressProposals(),
    failedProposals(),
    cancelledProposals(),
    completedProposals(),
    failedDraftProposals(),
  ]);

  return responses.flat();
}

async function myProposals(actor: string) {
  const responses = await Promise.all(
    defaultFilterStatus.map(f =>
      userProposals({
        actor,
        proposalStatusKey: f,
      })
    )
  );

  return responses.flat();
}

function toReviewProposals() {
  return submittedProposals();
}

async function proposalsWithReviewable() {
  try {
    const proposalsResponse = await Promise.all([inProgressProposals(), inReviewProposals()]);
    const proposalMapping = proposalsResponse.flat().reduce((acc, proposal) => {
      acc[proposal.proposal_id] = proposal;

      return acc;
    }, {} as Record<number, Proposal>);
    const proposals = Object.values(proposalMapping);

    const deliverables = await Promise.all(
      proposals.map(p =>
        deliverablesWithStatus({
          proposalId: p.proposal_id,
          deliverableStatusKey: DeliverableStatusKey.REPORTED,
        })
      )
    );

    return deliverables.flat().map(({ proposalId }) => proposalMapping[proposalId]);
  } catch (e) {
    console.error('[proposerDeliverableNotifications] Error', e);

    return [];
  }
}

function filterCategory(categories: Set<number | undefined> | null) {
  return (proposal: Proposal) => (!categories?.size ? true : categories.has(proposal.category));
}

function filterByName(search: string | null) {
  const lowerCaseSearch = search?.trim()?.toLowerCase();

  return (proposal: Proposal) =>
    !lowerCaseSearch
      ? true
      : proposal.proposer.toLowerCase().includes(lowerCaseSearch) ||
        proposal.title.toLowerCase().includes(lowerCaseSearch) ||
        proposal.proposal_id.toString().includes(lowerCaseSearch) ||
        proposal.description.toLowerCase().includes(lowerCaseSearch);
}

function filterByStatus(statuses: Set<ProposalStatusKey>) {
  return (proposal: Proposal) => (!statuses.size ? true : statuses.has(proposal.status));
}

function filterUnique() {
  const uniqueProposals = new Set<number>();

  return (proposal: Proposal) => {
    const found = uniqueProposals.has(proposal.proposal_id);

    if (!found) {
      uniqueProposals.add(proposal.proposal_id);
    }

    return !found;
  };
}

function sorter(sortBy: SortBy) {
  return (proposalA: Proposal, proposalB: Proposal) => {
    if (sortBy === SortBy.MIN_WAX_REQUESTED) {
      return currencyToFloat(proposalA.total_requested_funds)! - currencyToFloat(proposalB.total_requested_funds)!;
    } else if (sortBy === SortBy.MAX_WAX_REQUESTED) {
      return currencyToFloat(proposalB.total_requested_funds)! - currencyToFloat(proposalA.total_requested_funds)!;
    } else if (sortBy === SortBy.CREATED_FIRST) {
      return proposalA.proposal_id - proposalB.proposal_id;
    } else if (sortBy === SortBy.CREATED_LAST) {
      return proposalB.proposal_id - proposalA.proposal_id;
    } else {
      return Date.parse(proposalB.update_ts) - Date.parse(proposalA.update_ts);
    }
  };
}
