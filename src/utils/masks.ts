import { type FactoryOpts } from 'imask';

export const usd = {
  mask: Number,
  scale: 2,
  thousandsSeparator: '',
  padFractionalZeros: true,
  normalizeZeros: true,
  radix: '.',
  min: 0,
} as FactoryOpts;
