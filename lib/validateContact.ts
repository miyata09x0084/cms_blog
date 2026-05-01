export interface ContactInput {
  name?: unknown;
  email?: unknown;
  body?: unknown;
  turnstileToken?: unknown;
}

export type ContactField = 'name' | 'email' | 'body' | 'turnstileToken';

export function validate(input: ContactInput): ContactField[] {
  const errors: ContactField[] = [];
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const body = typeof input.body === 'string' ? input.body.trim() : '';
  const token = typeof input.turnstileToken === 'string' ? input.turnstileToken : '';

  if (name.length < 1 || name.length > 50) errors.push('name');
  if (
    email.length === 0 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.push('email');
  }
  if (body.length < 10 || body.length > 2000) errors.push('body');
  if (token.length === 0) errors.push('turnstileToken');

  return errors;
}
