import React from 'react';
import Head from 'next/head';
import { DitherBlock, StatusBar } from '../../components/ui';

const works = [
  {
    title: 'DAILY COWORKER',
    href: 'https://github.com/miyata09x0084/daily-coworker',
    desc: 'Claude Code 上に構築した個人向け AI アシスタント。スケジュール管理・リサーチ・記事執筆をスキルとして統合。',
    tags: 'AI · AGENT',
  },
  {
    title: 'SLIDE PILOT',
    href: 'https://slide-pilot-474305.web.app/',
    desc: 'Multimodal LLM で PDF をスライド・ナレーション付き動画へ自動変換するエージェント。LangGraph で構築。',
    tags: 'LLM · WEB',
  },
  {
    title: 'KANGEKI DAPP',
    href: 'https://kangeki-dapps.web.app/',
    desc: 'Ethereum 上で SoulBound Token を発行・管理する分散アプリケーション。',
    tags: 'WEB3 · DAPP',
  },
];

const WorkIndex = () => {
  return (
    <div>
      <Head>
        <title>Ryo Miyata — Creations</title>
      </Head>

      <div className="px-5 pt-7 pb-3">
        <div className="font-pixel text-[26px] leading-none">
          <span className="opacity-50">// </span>creations
        </div>
        <div className="font-vt text-[14px] opacity-65 mt-1.5">
          things i made · {works.length} items
        </div>
      </div>
      <DitherBlock />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
        {works.map((w) => (
          <a
            key={w.title}
            href={w.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-current p-4 no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            <div className="font-pixel text-[13px]">{w.title}</div>
            <div className="text-[12px] mt-2 opacity-85 leading-[1.65]">{w.desc}</div>
            <span className="inline-block mt-3 font-pixel text-[9px] opacity-60 border border-current px-1.5 py-px">
              {w.tags}
            </span>
          </a>
        ))}
      </div>

      <StatusBar left={`creations: ${works.length}`} right="updated occasionally" />
    </div>
  );
};

export default WorkIndex;
