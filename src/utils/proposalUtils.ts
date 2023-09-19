import { DeliverableStatus, DeliverableStatusKey, ProposalStatus, ProposalStatusKey } from '@/constants.ts';

export function toProposalStatus(statusKey: ProposalStatusKey): ProposalStatus {
  switch (statusKey) {
    case ProposalStatusKey.DRAFTING:
      return ProposalStatus.DRAFTING;
    case ProposalStatusKey.SUBMITTED:
      return ProposalStatus.REVIEW;
    case ProposalStatusKey.APPROVED:
      return ProposalStatus.APPROVED;
    case ProposalStatusKey.VOTING:
      return ProposalStatus.VOTING;
    case ProposalStatusKey.IN_PROGRESS:
      return ProposalStatus.IN_PROGRESS;
    case ProposalStatusKey.FAILED:
      return ProposalStatus.REJECTED;
    case ProposalStatusKey.FAILED_DRAFT:
      return ProposalStatus.FAILED_DRAFT;
    case ProposalStatusKey.CANCELLED:
      return ProposalStatus.CANCELLED;
    default:
      return ProposalStatus.COMPLETE;
  }
}

export function toDeliverableStatus(statusKey: DeliverableStatusKey): DeliverableStatus {
  switch (statusKey) {
    case DeliverableStatusKey.DRAFTING:
      return DeliverableStatus.DRAFTING;
    case DeliverableStatusKey.ACCEPTED:
      return DeliverableStatus.ACCEPTED;
    case DeliverableStatusKey.CLAIMED:
      return DeliverableStatus.CLAIMED;
    case DeliverableStatusKey.IN_PROGRESS:
      return DeliverableStatus.IN_PROGRESS;
    case DeliverableStatusKey.REJECTED:
      return DeliverableStatus.REJECTED;
    case DeliverableStatusKey.REPORTED:
      return DeliverableStatus.REPORTED;
    default:
      return DeliverableStatus.REPORTED;
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
