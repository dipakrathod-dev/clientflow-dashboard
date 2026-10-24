const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const clientStatuses = new Set(['Active', 'Pending', 'Completed'])
const projectStatuses = new Set(['Active', 'Pending', 'Completed'])
const invoiceStatuses = new Set(['Paid', 'Pending', 'Overdue'])

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

export function validateProjectForm(values) {
  const errors = {}
  const name = String(values?.name ?? '').trim()
  const client = String(values?.client ?? '').trim()
  const progress = String(values?.progress ?? '').trim()
  const deadline = String(values?.deadline ?? '').trim()
  const budget = String(values?.budget ?? '').trim()

  if (!name) errors.name = 'Project name is required.'
  else if (name.length > 120) errors.name = 'Project name must be 120 characters or fewer.'

  if (!client) errors.client = 'Client name is required.'
  else if (client.length > 120) errors.client = 'Client name must be 120 characters or fewer.'

  if (!progress || !Number.isInteger(Number(progress)) || Number(progress) < 0 || Number(progress) > 100) {
    errors.progress = 'Progress must be a whole number from 0 to 100.'
  }

  if (!deadline) errors.deadline = 'Deadline is required.'
  else if (deadline.length > 50) errors.deadline = 'Deadline must be 50 characters or fewer.'

  if (!budget || !Number.isFinite(Number(budget)) || Number(budget) < 0) {
    errors.budget = 'Budget must be a non-negative number.'
  }

  if (!projectStatuses.has(values?.status)) errors.status = 'Choose a valid status.'
  return errors
}

export function validateInvoiceForm(values) {
  const errors = {}
  const invoiceNumber = String(values?.invoiceNumber ?? '').trim()
  const client = String(values?.client ?? '').trim()
  const project = String(values?.project ?? '').trim()
  const amount = String(values?.amount ?? '').trim()
  const paymentMethod = String(values?.paymentMethod ?? '').trim()
  const dueDate = String(values?.dueDate ?? '').trim()

  if (!invoiceNumber) errors.invoiceNumber = 'Invoice number is required.'
  else if (invoiceNumber.length > 50) errors.invoiceNumber = 'Invoice number must be 50 characters or fewer.'

  if (!client) errors.client = 'Client name is required.'
  else if (client.length > 120) errors.client = 'Client name must be 120 characters or fewer.'

  if (!project) errors.project = 'Project name is required.'
  else if (project.length > 120) errors.project = 'Project name must be 120 characters or fewer.'

  if (!amount || !Number.isFinite(Number(amount)) || Number(amount) < 0) {
    errors.amount = 'Amount must be a non-negative number.'
  }

  if (!paymentMethod) errors.paymentMethod = 'Payment method is required.'
  else if (paymentMethod.length > 80) errors.paymentMethod = 'Payment method must be 80 characters or fewer.'

  if (!dueDate) errors.dueDate = 'Due date is required.'
  else if (dueDate.length > 50) errors.dueDate = 'Due date must be 50 characters or fewer.'

  if (!invoiceStatuses.has(values?.status)) errors.status = 'Choose a valid status.'
  return errors
}
