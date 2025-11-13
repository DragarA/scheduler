export function formatPrice(priceCents?: number | null, currency?: string | null) {
  if (priceCents === null || priceCents === undefined) {
    return 'N/A';
  }
  const price = priceCents / 100;
  const currencySymbol = currency || '$';
  return `${currencySymbol}${price.toFixed(2)}`;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

