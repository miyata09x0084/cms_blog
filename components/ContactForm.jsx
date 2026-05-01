import React, { useEffect, useState } from 'react';

const inputClass =
  'w-full border border-current bg-transparent px-2 py-1.5 text-[13px] font-jp focus:outline-none focus:bg-[var(--fg)] focus:text-[var(--bg)]';
const labelClass = 'font-pixel text-[10px] tracking-wider opacity-70 block mb-1';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    const cb = (token) => setTurnstileToken(token);
    window.onTurnstileSuccess = cb;
    return () => {
      delete window.onTurnstileSuccess;
    };
  }, []);

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    body.trim().length > 0 &&
    turnstileToken.length > 0;

  return (
    <form>
      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-name">NAME</label>
        <input
          id="cf-name"
          type="text"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        ▸ send message
      </button>
    </form>
  );
};

export default ContactForm;
