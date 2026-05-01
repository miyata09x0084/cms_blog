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

describe('<ContactForm /> submitting and done', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

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

describe('<ContactForm /> error banner', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  it('shows generic banner and resets Turnstile when API returns 502 send_failed', async () => {
    const resetMock = jest.fn();
    window.turnstile = { reset: resetMock };
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ ok: false, error: 'send_failed' }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    await act(async () => {
      window.onTurnstileSuccess('tk-x');
    });
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/送信に失敗しました/)).toBeInTheDocument();
    expect(screen.getByLabelText(/NAME/i)).toBeInTheDocument(); // form still present
    expect(resetMock).toHaveBeenCalled();
  });

  it('shows captcha-specific banner when API returns 400 captcha_failed', async () => {
    window.turnstile = { reset: jest.fn() };
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ ok: false, error: 'captcha_failed' }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    await act(async () => {
      window.onTurnstileSuccess('tk-x');
    });
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/ロボット判定に失敗/)).toBeInTheDocument();
  });
});

describe('<ContactForm /> inline validation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  it('shows inline email error and does not call fetch', async () => {
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy;
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'abc'); // invalid
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    await act(async () => {
      window.onTurnstileSuccess('tk-x');
    });
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText(/メールアドレスの形式/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows inline body length error', async () => {
    global.fetch = jest.fn();
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'short');
    await act(async () => {
      window.onTurnstileSuccess('tk-x');
    });
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText(/10〜2000 文字/)).toBeInTheDocument();
  });
});
