// Admin date filters come from <input type="date">, which yields a bare
// "YYYY-MM-DD". Used directly as an upper bound against a timestamptz column
// that resolves to midnight, silently excluding the whole final day - so
// filtering "to today" would return nothing from today. Extend it to the end of
// that day instead. Values that already carry a time component pass through.
export function endOfDay(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T23:59:59.999` : date;
}
