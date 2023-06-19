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

  const result = toFloat((requestedAmount as string).split(' ')[0]);

  return result && !isNaN(result) ? result : null;
}
