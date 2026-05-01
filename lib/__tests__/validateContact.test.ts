import { validate } from '../validateContact';

const valid = {
  name: 'Ryo',
  email: 'ryo@example.com',
  body: 'これは10文字以上の本文。',
  turnstileToken: 'token-xyz',
};

describe('validate()', () => {
  it('returns empty array for fully valid input', () => {
    expect(validate(valid)).toEqual([]);
  });

  it('returns ["name"] when name is empty', () => {
    expect(validate({ ...valid, name: '' })).toEqual(['name']);
  });

  it('returns ["name"] when name exceeds 50 chars', () => {
    expect(validate({ ...valid, name: 'a'.repeat(51) })).toEqual(['name']);
  });

  it('returns ["name"] when name is whitespace only', () => {
    expect(validate({ ...valid, name: '   ' })).toEqual(['name']);
  });

  it('returns ["email"] when email is empty', () => {
    expect(validate({ ...valid, email: '' })).toEqual(['email']);
  });

  it('returns ["email"] when email lacks @', () => {
    expect(validate({ ...valid, email: 'invalid' })).toEqual(['email']);
  });

  it('returns ["email"] when email lacks domain dot', () => {
    expect(validate({ ...valid, email: 'a@b' })).toEqual(['email']);
  });

  it('returns ["email"] when email is 255 chars', () => {
    const longLocal = 'a'.repeat(250);
    expect(validate({ ...valid, email: `${longLocal}@b.cd` })).toEqual(['email']);
  });

  it('returns ["body"] when body is empty', () => {
    expect(validate({ ...valid, body: '' })).toEqual(['body']);
  });

  it('returns ["body"] when body is 9 chars', () => {
    expect(validate({ ...valid, body: 'a'.repeat(9) })).toEqual(['body']);
  });

  it('returns ["body"] when body is 2001 chars', () => {
    expect(validate({ ...valid, body: 'a'.repeat(2001) })).toEqual(['body']);
  });

  it('returns ["body"] when body trims to empty', () => {
    expect(validate({ ...valid, body: '          ' })).toEqual(['body']);
  });

  it('returns ["turnstileToken"] when token is empty string', () => {
    expect(validate({ ...valid, turnstileToken: '' })).toEqual(['turnstileToken']);
  });

  it('returns ["turnstileToken"] when token is undefined', () => {
    expect(validate({ ...valid, turnstileToken: undefined })).toEqual(['turnstileToken']);
  });

  it('returns ["name","email"] when both are bad (preserved order)', () => {
    expect(validate({ ...valid, name: '', email: 'bad' })).toEqual(['name', 'email']);
  });

  it('returns all four fields when all are bad', () => {
    expect(validate({ name: '', email: '', body: '', turnstileToken: '' })).toEqual([
      'name', 'email', 'body', 'turnstileToken',
    ]);
  });
});
