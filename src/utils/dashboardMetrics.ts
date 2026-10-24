import type { ClientRecord, InvoiceRecord } from '../types/records';

const MONTH_COUNT = 6;
type DateLike = Date | string | number | { toDate: () => Date } | undefined;

function toDate(value: DateLike): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') return value.toDate();

  const date = new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function createMonthBuckets(referenceDate: DateLike = new Date(), count = MONTH_COUNT): Array<{ key: string; month: string }> {
  const reference = toDate(referenceDate) || new Date();
  const buckets = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(reference.getFullYear(), reference.getMonth() - offset, 1);
    buckets.push({
      key: monthKey(date),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    });
  }

  return buckets;
}

export function buildRevenueTrend(invoices: InvoiceRecord[] = [], referenceDate: DateLike = new Date()) {
  const buckets = createMonthBuckets(referenceDate);
  const totals = new Map(buckets.map(({ key }) => [key, 0]));

  invoices.forEach((invoice) => {
    if (invoice.status !== 'Paid') return;
    const date = toDate(invoice.dueDate) || toDate(invoice.createdAt);
    if (!date) return;

    const key = monthKey(date);
    if (totals.has(key)) totals.set(key, totals.get(key)! + Number(invoice.amount || 0));
  });

  return buckets.map(({ key, month }) => ({ month, revenue: totals.get(key) ?? 0 }));
}

export function buildClientGrowthTrend(clients: ClientRecord[] = [], referenceDate: DateLike = new Date()) {
  const buckets = createMonthBuckets(referenceDate);
  const monthCounts = new Map(buckets.map(({ key }) => [key, 0]));

  clients.forEach((client) => {
    const date = toDate(client.createdAt);
    if (!date) return;

    const key = monthKey(date);
    if (monthCounts.has(key)) monthCounts.set(key, monthCounts.get(key)! + 1);
  });

  let cumulative = 0;
  return buckets.map(({ key, month }) => {
    cumulative += monthCounts.get(key) ?? 0;
    return { month, clients: cumulative };
  });
}
