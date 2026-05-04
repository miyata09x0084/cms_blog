import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { getPosts } from "../services";
import { SectionHeading, DitherBlock } from "../components/ui";

interface PostNode {
  node: {
    title: string;
    slug: string;
    createdAt: string;
    categories?: { name: string; slug: string }[];
  };
}

interface Props {
  posts: PostNode[];
}

const Home: NextPage<Props> = ({ posts }) => {
  const recent = posts.slice(0, 3);

  return (
    <div>
      <Head>
        <title>Ryo Miyata — Home</title>
      </Head>

      {/* Hero */}
      <section className="px-5 pt-8 pb-6">
        <h1 className="font-pixel text-[42px] leading-none tracking-[-0.02em]">
          RYO<br />MIYATA
          <span className="cursor-blink ml-1 w-[14px] h-[36px] align-[-4px]" />
        </h1>
        <div className="font-pixel text-[11px] mt-3 opacity-85 tracking-wider">
          FULL-STACK DEVELOPER · BASED IN JAPAN
        </div>
        <div className="font-jp text-[13px] mt-4 leading-[1.7]">
          ものを作っては考え、考えてはまた作る。
        </div>
      </section>

      <DitherBlock />

      {/* About */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>about</SectionHeading>
        <p className="font-jp text-[13px] leading-[1.8]">
          双子の弟として生まれ、頭の中に湧きつづける半端なアイデアをかたちにすることに最も生を感じる。プログラミングはそれを引き出して、人が使えるアプリへと立ち上げるための職人芸。2020年から開発、2023年からフリーランス。
        </p>
      </section>

      {/* Interests */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>interests</SectionHeading>
        <div className="font-pixel text-[11px] tracking-wider">
          ▸ THINKING &nbsp;▸ FOOD-TOURING &nbsp;▸ TRAVELING &nbsp;▸ RUNNING ROUTINE &nbsp;▸ COOKING
        </div>
      </section>

      {/* Posts */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>posts</SectionHeading>
        <div>
          {recent.map((p) => (
            <Link
              key={p.node.slug}
              href={`/post/${p.node.slug}`}
              className="grid grid-cols-[12px_1fr_auto] gap-3 py-1.5 border-b border-current border-dashed text-[12px] no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            >
              <span className="font-pixel">▸</span>
              <span>{p.node.title}</span>
              <span className="font-pixel text-[10px] opacity-60">
                {new Date(p.node.createdAt).toISOString().slice(0, 7).replace('-', '.')}
              </span>
            </Link>
          ))}
        </div>
        <Link href="/post" className="inline-block mt-3 font-pixel text-[11px] underline">
          view all posts ▸
        </Link>
      </section>

      {/* Creations */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>creations</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <a href="https://github.com/miyata09x0084/daily-coworker" target="_blank" rel="noopener noreferrer" className="border border-current p-2.5 no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]">
            <div className="font-pixel text-[11px]">DAILY COWORKER</div>
            <div className="text-[11px] mt-1 opacity-85">Claude Code 上の個人 AI アシスタント</div>
            <span className="inline-block mt-2 font-pixel text-[9px] opacity-60 border border-current px-1.5 py-px">AI · AGENT</span>
          </a>
          <a href="https://slide-pilot-474305.web.app/" target="_blank" rel="noopener noreferrer" className="border border-current p-2.5 no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]">
            <div className="font-pixel text-[11px]">SLIDE PILOT</div>
            <div className="text-[11px] mt-1 opacity-85">Multimodal LLM で PDF を動画に変換</div>
            <span className="inline-block mt-2 font-pixel text-[9px] opacity-60 border border-current px-1.5 py-px">LLM · WEB</span>
          </a>
          <a href="https://kangeki-dapps.web.app/" target="_blank" rel="noopener noreferrer" className="border border-current p-2.5 no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]">
            <div className="font-pixel text-[11px]">KANGEKI DAPP</div>
            <div className="text-[11px] mt-1 opacity-85">SoulBound Token を発行する分散アプリ</div>
            <span className="inline-block mt-2 font-pixel text-[9px] opacity-60 border border-current px-1.5 py-px">WEB3 · DAPP</span>
          </a>
        </div>
        <Link href="/work" className="inline-block mt-3.5 font-pixel text-[11px] underline">
          view all creations ▸
        </Link>
      </section>

      {/* Contact */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>contact</SectionHeading>
        <Link href="/contact" className="font-pixel text-[12px] underline">
          ▸ open contact form
        </Link>
      </section>
    </div>
  );
};

export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return { props: { posts } };
}

export default Home;
