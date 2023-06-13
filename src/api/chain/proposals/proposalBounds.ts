import { Serialize } from 'eosjs';
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

export function nameBounds(statusKey: ProposalStatusKey, accountName: string): ProposalBounds {
  const sb = new Serialize.SerialBuffer({
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
  });
  sb.pushName(accountName);

  const reversedArray = new Uint8Array(16);
  reversedArray.set(sb.array.slice(0, 8).reverse());
  reversedArray.set([statusKey], 8);

  const lowerHexIndex = Buffer.from(reversedArray).toString('hex');
  const lowerBound = '0x' + lowerHexIndex;

  for (let i = 9; i < 16; i++) {
    reversedArray.set([0xff], i);
  }

  const upperHexIndex = Buffer.from(reversedArray).toString('hex');
  const upperBound = '0x' + upperHexIndex;

  return {
    lowerBound: lowerBound,
    upperBound: upperBound,
  };
}
