import { Asset } from '@wharfkit/session';

export function toFloat(str: string | null) {
  if (str == null) {
    return null;
  }

  return parseFloat(parseFloat(str).toFixed(2));
}

export function currencyToFloat(requestedAmount: string | null | number) {
  if (requestedAmount == null) {
    return null;
  }

  if (typeof requestedAmount === 'number') {
    return requestedAmount;
  }

  try {
    const result = Asset.from(requestedAmount);
    return result.value ?? null;
  } catch {
    const result = toFloat(requestedAmount.split(' ')[0]);
    return result && !isNaN(result) ? result : null;
  }
}
