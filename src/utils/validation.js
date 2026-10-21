const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function validateRequired(value, label) {
  return String(value ?? '').trim() ? '' : `${label} is required.`;
}

export function validateEmail(value) {
  const requiredError = validateRequired(value, 'Email');
  if (requiredError) return requiredError;

  const email = String(value).trim();
  if (email.length > 254) return 'Email must be 254 characters or fewer.';
  return EMAIL_PATTERN.test(email) ? '' : 'Please enter a valid email address.';
}

export function validatePassword(value, { minLength = 6 } = {}) {
  if (!value) return 'Password is required.';
  if (value.length < minLength) return `Password must be at least ${minLength} characters long.`;
  return '';
}

export function validateClientForm(formData) {
  const errors = {};
  const name = String(formData.name ?? '').trim();
  const company = String(formData.company ?? '').trim();
  const email = String(formData.email ?? '').trim();
  const budgetValue = String(formData.budget ?? '').trim();

  const nameError = validateRequired(name, 'Name');
  if (nameError) errors.name = nameError;
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.';

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  const companyError = validateRequired(company, 'Company');
  if (companyError) errors.company = companyError;
  else if (company.length > 120) errors.company = 'Company must be 120 characters or fewer.';

  if (!budgetValue) {
    errors.budget = 'Budget is required.';
  } else {
    const budget = Number(budgetValue);
    if (!Number.isFinite(budget)) errors.budget = 'Budget must be a valid number.';
    else if (budget < 0) errors.budget = 'Budget cannot be negative.';
  }

  if (!['Active', 'Pending', 'Completed'].includes(formData.status)) {
    errors.status = 'Please select a valid status.';
  }

  return errors;
}
