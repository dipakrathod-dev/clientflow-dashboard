import { describe, expect, it } from 'vitest'
import { validateClientForm, validateDisplayName, validateEmail } from './validation'

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
})
