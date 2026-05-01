import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const inputClass =
  'w-full border border-current bg-transparent px-2 py-1.5 text-[13px] font-jp focus:outline-none focus:bg-[var(--fg)] focus:text-[var(--bg)] disabled:opacity-50';
const labelClass = 'font-pixel text-[10px] tracking-wider opacity-70 block mb-1';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | done

  useEffect(() => {
    window.onTurnstileSuccess = (token) => setTurnstileToken(token);
    return () => {
      delete window.onTurnstileSuccess;
    };
  }, []);

  const canSubmit =
    status === 'idle' &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    body.trim().length > 0 &&
    turnstileToken.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, body, turnstileToken }),
      });
      if (res.ok) {
        setStatus('done');
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <div>
        <p className="font-pixel text-[16px]">▸ message sent.</p>
        <p className="font-jp text-[12px] mt-3 leading-[1.7] opacity-80">
          ありがとうございます。<br />
          通常 1〜3 営業日以内にお返事します。
        </p>
        <Link
          href="/"
          className="font-pixel text-[11px] underline mt-6 inline-block"
        >
          ▸ back to home
        </Link>
      </div>
    );
  }

  const fieldsDisabled = status === 'submitting';

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-name">NAME</label>
        <input
          id="cf-name"
          type="text"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={fieldsDisabled}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-email">EMAIL</label>
        <input
          id="cf-email"
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={fieldsDisabled}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-body">MESSAGE</label>
        <textarea
          id="cf-body"
          rows={6}
          className={inputClass}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={fieldsDisabled}
        />
      </div>

      <div
        className="cf-turnstile mb-4"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-callback="onTurnstileSuccess"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="border border-current px-3 py-1.5 font-pixel text-[11px] hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:opacity-50"
      >
        {status === 'submitting' ? '▸ sending...' : '▸ send message'}
      </button>
    </form>
  );
};

export default ContactForm;
