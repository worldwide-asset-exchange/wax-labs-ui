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

export function formatCurrency(waxValue: number | string | null) {
  let currency = TOKEN_SYMBOL;

  if (typeof waxValue === 'string') {
    const [value, symbol] = waxValue.split(' ');

    currency = symbol.trim() || TOKEN_SYMBOL;

    waxValue = Number(value);
  }

  return `${formatDecimal(waxValue)} ${currency}`;
}
