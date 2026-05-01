import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

beforeEach(() => {
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key';
  // Turnstile グローバル stub
  // eslint-disable-next-line no-undef
  window.turnstile = { reset: jest.fn() };
});

describe('<ContactForm /> idle', () => {
  it('renders all three fields and a disabled submit button', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/NAME/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/EMAIL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MESSAGE/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /send message/i });
    expect(button).toBeDisabled();
  });

  it('keeps button disabled when fields are filled but Turnstile token is missing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});

describe('<ContactForm /> submitting and done', () => {
  it('enables button when Turnstile callback fires with a token', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    await act(async () => {
      window.onTurnstileSuccess('tk-x');
    });
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('shows sending... while fetch is pending and replaces form on 200', async () => {
    let resolveFetch;
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = () =>
            resolve({
              ok: true,
              json: async () => ({ ok: true }),
            });
        }),
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    await act(async () => {
      window.onTurnstileSuccess('tk-x');
    });

    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();

    await act(async () => {
      resolveFetch();
    });
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    expect(screen.getByText(/back to home/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/NAME/i)).not.toBeInTheDocument();
  });
});
