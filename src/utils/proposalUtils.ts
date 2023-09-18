import { ProposalStatus, ProposalStatusKey } from '@/constants.ts';

export function toProposalStatus(statusKey: ProposalStatusKey): ProposalStatus {
  switch (statusKey) {
    case ProposalStatusKey.DRAFTING:
      return ProposalStatus.DRAFTING;
    case ProposalStatusKey.SUBMITTED_OR_DELIVERABLE_IN_PROGRESS:
      return ProposalStatus.REVIEW;
    case ProposalStatusKey.APPROVED_OR_REPORTED:
      return ProposalStatus.APPROVED;
    case ProposalStatusKey.VOTING_OR_ACCEPTED:
      return ProposalStatus.VOTING;
    case ProposalStatusKey.REJECTED_OR_PROPOSAL_IN_PROGRESS:
      return ProposalStatus.IN_PROGRESS;
    case ProposalStatusKey.FAILED_OR_CLAIMED:
      return ProposalStatus.REJECTED;
    case ProposalStatusKey.FAILED_DRAFT:
      return ProposalStatus.FAILED_DRAFT;
    case ProposalStatusKey.CANCELLED:
      return ProposalStatus.CANCELLED;
    default:
      return ProposalStatus.COMPLETE;
  }
}

const validCharacters = '12345abcdefghijklmnopqrstuvxyz';
export function randomEosioName(length = 12) {
  const result: string[] = [];

  for (let i = 0; i < length; i++) {
    result.push(validCharacters.charAt(Math.floor(Math.random() * validCharacters.length)));
  }

  return result.join('');
}
