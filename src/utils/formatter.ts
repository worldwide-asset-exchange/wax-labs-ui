export function calculateWAXPrice(formattedUSDPrice: number, intendedDelphiMedian: number): string {
  if (intendedDelphiMedian) {
    return (formattedUSDPrice / (intendedDelphiMedian / 1e4)).toFixed(2);
  } else {
    return '0';
  }
}

export function calculateUSDPrice(formattedWAXPrice: number, intendedDelphiMedian: number): string {
  return (formattedWAXPrice * (intendedDelphiMedian / 1e4)).toFixed(2);
}
