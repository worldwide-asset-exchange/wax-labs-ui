export function toFloat(str: string) {
  return parseFloat(parseFloat(str).toFixed(2));
}

export function requestedAmountToFloat(requestedAmount: string | null | number) {
  if (requestedAmount == null || isNaN(requestedAmount as number)) {
    return null;
  }

  if (typeof requestedAmount === 'number') {
    return requestedAmount;
  }

  return toFloat((requestedAmount as string).split(' ')[0]);
}

export function numberWithCommas(n) {
  const parts = n.toString().split('.');
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
}
