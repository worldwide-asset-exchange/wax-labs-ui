import { useQuery } from '@tanstack/react-query';

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
import { ProposalStatusKey, SortBy, Whose } from '@/constants.ts';
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

const allProposals = () =>
  Promise.all([
    inDrafting(),
    inReviewProposals(),
    approvedProposals(),
    inVotingProposals(),
    inProgressProposals(),
    failedProposals(),
    cancelledProposals(),
    completedProposals(),
    failedDraftProposals(),
  ]).then(r => r.flat());

const myProposals = (actor: string) =>
  Promise.all(
    defaultFilterStatus.map(f =>
      userProposals({
        actor,
        proposalStatusKey: f,
      })
    )
  ).then(r => r.flat());

const toReviewProposals = () => submittedProposals();

export function useProposalFilter({
  sortBy,
  search,
  status,
  whose,
  categories,
  actAsActor,
}: ProposalSearchForm & { actAsActor?: string }): ProposalFilterReturn {
  const { actor, isAuthenticated } = useChain();
  const { isAdmin, configs } = useConfigData();
  const statusKeys = new Set(status?.map(s => statusFilterMapping()[s]) ?? []);
  const statusWithoutReview = new Set(statusKeys);
  statusWithoutReview.delete(ProposalStatusKey.NOT_REVIEWED_DELIVERABLE);

  const sortByKey = sortBy ? sortByMapping()[sortBy] : null;
  const categoryKeys = new Set(categories ? categories.map(c => configs?.categories.indexOf(c)) : []);
  const whoseKey = whose ? whoseFilterMapping()[whose] : null;
  const enabled = !(
    (whoseKey === Whose.MY_PROPOSALS && isAuthenticated !== true) ||
    (whoseKey === Whose.PROPOSALS_TO_REVIEW && isAdmin !== true)
  );

  let proposalQueries: () => Promise<Proposal[]>;
  if (whoseKey === Whose.MY_PROPOSALS || actAsActor != null) {
    proposalQueries = () => myProposals((actAsActor ?? actor) as string);
  } else if (whoseKey === Whose.ALL_PROPOSALS) {
    proposalQueries = allProposals;
  } else {
    proposalQueries = () => toReviewProposals();
  }

  const { isLoading, data: proposals } = useQuery({
    queryKey: [
      'proposalsFilter',
      actor,
      sortBy,
      search,
      status,
      whose,
      categories,
      actAsActor,
      statusKeys,
      categoryKeys,
      statusWithoutReview,
      sortByKey,
      isAdmin,
    ],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      let proposals = (await proposalQueries()) ?? [];

      proposals = proposals
        .filter(filterUnique())
        .filter(filterByStatus(statusWithoutReview))
        .filter(filterCategory(categoryKeys))
        .filter(filterByName(search));

      if (statusKeys.has(ProposalStatusKey.NOT_REVIEWED_DELIVERABLE) && isAdmin) {
        return hasReviewableDeliverables(proposals);
      }

      if (sortByKey != null) {
        proposals?.sort(sorter(sortByKey));
      }

      return proposals;
    },
    enabled,
  });

  return { proposals: proposals ?? [], isLoading };
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
