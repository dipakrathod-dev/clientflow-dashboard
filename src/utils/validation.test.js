import { describe, expect, it } from 'vitest'
import {
  validateClientForm,
  validateDisplayName,
  validateEmail,
  validateInvoiceForm,
  validateProjectForm,
} from './validation'

describe('validation helpers', () => {
  it('accepts valid client data and email', () => {
    expect(validateEmail('person@example.com')).toBe('')
    expect(validateClientForm({ name: 'A', email: 'person@example.com', company: 'Co', budget: '1000', status: 'Active' })).toEqual({})
  })

  it('returns field errors for invalid client data', () => {
    expect(validateClientForm({ name: '', email: 'bad', company: '', budget: '-1', status: 'Unknown' })).toEqual({
      name: 'Name is required.',
      email: 'Enter a valid email address.',
      company: 'Company is required.',
      budget: 'Budget must be a non-negative number.',
      status: 'Choose a valid status.',
    })
  })

  it('bounds display names', () => {
    expect(validateDisplayName('')).toBe('Please enter a display name.')
    expect(validateDisplayName('A'.repeat(101))).toContain('100 characters')
    expect(validateDisplayName('Dipak')).toBe('')
  })

  it('validates project and invoice records', () => {
    expect(validateProjectForm({
      name: 'Website',
      client: 'Acme',
      progress: '50',
      deadline: '2026-10-30',
      status: 'Active',
      budget: '25000',
    })).toEqual({})

    expect(validateInvoiceForm({
      invoiceNumber: 'INV-1001',
      client: 'Acme',
      project: 'Website',
      amount: '25000',
      paymentMethod: 'Bank transfer',
      dueDate: '2026-10-30',
      status: 'Pending',
    })).toEqual({})
  })

  it('rejects invalid project and invoice boundaries', () => {
    expect(validateProjectForm({ progress: '101', status: 'Unknown' })).toMatchObject({
      name: 'Project name is required.',
      progress: 'Progress must be a whole number from 0 to 100.',
      status: 'Choose a valid status.',
    })

    expect(validateInvoiceForm({ amount: '-1', status: 'Unknown' })).toMatchObject({
      invoiceNumber: 'Invoice number is required.',
      amount: 'Amount must be a non-negative number.',
      status: 'Choose a valid status.',
    })
  })
})
