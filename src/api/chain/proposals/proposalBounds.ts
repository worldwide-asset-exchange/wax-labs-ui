import { Uint64LE } from 'int64-buffer';

import { ProposalStatusKey } from '@/constants.ts';

export interface ProposalBounds {
  lowerBound: string;
  upperBound: string;
}

export function statBounds(statusKey: ProposalStatusKey): ProposalBounds {
  const reversedArray = new Uint8Array(8);
  reversedArray.set([statusKey], 7);

  const lowerBound = new Uint64LE(reversedArray).toString(10);

  for (let i = 0; i < 7; i++) {
    reversedArray.set([0xff], i);
  }

  const upperBound = new Uint64LE(reversedArray).toString(10);

  return {
    lowerBound: lowerBound,
    upperBound: upperBound,
  };
}
