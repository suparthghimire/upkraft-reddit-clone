export function toDate(value: string | null | undefined) {
  return value ? new Date(value) : new Date(Number.NaN);
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function formatDate(value: string) {
  const date = toDate(value);

  return Number.isNaN(date.getTime()) ? 'Recently' : dateFormatter.format(date);
}

export function getDateTime(value: string) {
  const date = toDate(value);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
