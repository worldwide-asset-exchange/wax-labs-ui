import { Name } from '@wharfkit/antelope';
import { Uint64LE } from 'int64-buffer';

import { ProposalStatusKey } from '@/constants.ts';

export interface ProposalBounds {
  lowerBound: string;
  upperBound: string;
}

function toHex(bytes: Uint8Array) {
  const hexOctets = new Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    hexOctets[i] = ('0' + (byte & 0xff).toString(16)).slice(-2);
  }

  return `0x${hexOctets.join('')}`;
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

export function nameBounds({ statusKey, actor }: { statusKey: ProposalStatusKey; actor: string }): ProposalBounds {
  const name = Name.from(actor);

  const reversedArray = new Uint8Array(16);
  reversedArray.set(name.value.byteArray.reverse());
  reversedArray.set([statusKey], 8);

  const lowerBound = toHex(reversedArray);

  for (let i = 9; i < 16; i++) {
    reversedArray.set([0xff], i);
  }

  const upperBound = toHex(reversedArray);

  return {
    lowerBound: lowerBound,
    upperBound: upperBound,
  };
}
