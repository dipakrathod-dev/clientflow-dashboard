const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const clientStatuses = new Set(['Active', 'Pending', 'Completed'])

export function validateEmail(value) {
  const email = String(value ?? '').trim()
  return emailPattern.test(email) ? '' : 'Enter a valid email address.'
}

export function validateClientForm(values) {
  const errors = {}
  const name = String(values?.name ?? '').trim()
  const email = String(values?.email ?? '').trim()
  const company = String(values?.company ?? '').trim()
  const budget = String(values?.budget ?? '').trim()

  if (!name) errors.name = 'Name is required.'
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.'

  if (!email) errors.email = 'Email is required.'
  else if (email.length > 254 || validateEmail(email)) errors.email = 'Enter a valid email address.'

  if (!company) errors.company = 'Company is required.'
  else if (company.length > 120) errors.company = 'Company must be 120 characters or fewer.'

  if (!budget) errors.budget = 'Budget is required.'
  else if (!Number.isFinite(Number(budget)) || Number(budget) < 0) errors.budget = 'Budget must be a non-negative number.'

  if (!clientStatuses.has(values?.status)) errors.status = 'Choose a valid status.'
  return errors
}

export function validateDisplayName(value) {
  const name = String(value ?? '').trim()
  if (!name) return 'Please enter a display name.'
  if (name.length > 100) return 'Display name must be 100 characters or fewer.'
  return ''
}
