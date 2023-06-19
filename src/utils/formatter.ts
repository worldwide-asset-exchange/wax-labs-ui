import { TOKEN_SYMBOL } from '@/constants.ts';

const numberFormatter = new Intl.NumberFormat(undefined, {
  style: 'decimal',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatDecimal(waxValue: number | null) {
  if (!waxValue) {
    return '0';
  }

  return numberFormatter.format(waxValue);
}

export function formatWax(waxValue: number | null) {
  return `${formatDecimal(waxValue)} ${TOKEN_SYMBOL}`;
}
