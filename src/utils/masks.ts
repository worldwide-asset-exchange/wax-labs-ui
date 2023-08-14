import { type FactoryOpts } from 'imask';

export const usd = {
  mask: 'value USD',
  lazy: false,
  overwrite: 'shift',
  eager: 'append',
  blocks: {
    value: {
      mask: Number,
      lazy: true,
      scale: 4,
      thousandsSeparator: '',
      padFractionalZeros: true,
      normalizeZeros: true,
      radix: '.',
      min: 0,
    },
  },
} as FactoryOpts;
