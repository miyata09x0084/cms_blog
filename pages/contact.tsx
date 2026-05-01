import type { NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { SectionHeading } from '../components/ui';
import ContactForm from '../components/ContactForm';

const Contact: NextPage = () => (
  <div>
    <Head>
      <title>Ryo Miyata — Contact</title>
    </Head>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      async
      defer
    />
    <section className="px-5 py-5 border-t border-current">
      <SectionHeading>contact</SectionHeading>
      <p className="font-jp text-[13px] leading-[1.8] mb-5">
        ご連絡ありがとうございます。お仕事のご相談、雑談、なんでもどうぞ。<br />
        通常 1〜3 営業日以内にお返事します。
      </p>
      <ContactForm />
    </section>
  </div>
);

export default Contact;
