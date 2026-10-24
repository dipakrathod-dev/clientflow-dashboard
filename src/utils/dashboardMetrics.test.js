import { describe, expect, it } from 'vitest'
import { buildClientGrowthTrend, buildRevenueTrend } from './dashboardMetrics.ts'

describe('dashboard metrics', () => {
  const referenceDate = new Date('2026-10-24T12:00:00Z')

  it('builds paid revenue totals for the last six months', () => {
    expect(buildRevenueTrend([
      { status: 'Paid', amount: 25000, dueDate: '2026-09-10' },
      { status: 'Pending', amount: 40000, dueDate: '2026-09-15' },
      { status: 'Paid', amount: 10000, dueDate: '2026-10-01' },
    ], referenceDate)).toEqual([
      { month: 'May', revenue: 0 },
      { month: 'Jun', revenue: 0 },
      { month: 'Jul', revenue: 0 },
      { month: 'Aug', revenue: 0 },
      { month: 'Sep', revenue: 25000 },
      { month: 'Oct', revenue: 10000 },
    ])
  })

  it('builds cumulative client growth from Firestore timestamps', () => {
    expect(buildClientGrowthTrend([
      { createdAt: new Date('2026-08-03T10:00:00Z') },
      { createdAt: new Date('2026-10-04T10:00:00Z') },
      { createdAt: new Date('2026-10-12T10:00:00Z') },
    ], referenceDate)).toEqual([
      { month: 'May', clients: 0 },
      { month: 'Jun', clients: 0 },
      { month: 'Jul', clients: 0 },
      { month: 'Aug', clients: 1 },
      { month: 'Sep', clients: 1 },
      { month: 'Oct', clients: 3 },
    ])
  })
})
