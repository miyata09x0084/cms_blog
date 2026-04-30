import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { getPosts, getCategories } from "../../services";
import { DitherBlock, StatusBar } from "../../components/ui";

const PostIndex = ({ posts, categories }) => {
  const router = useRouter();
  const [active, setActive] = useState("all");

  useEffect(() => {
    const q = router.query.category;
    if (typeof q === "string" && q.length > 0) setActive(q);
  }, [router.query.category]);

  const filtered = useMemo(() => {
    if (active === "all") return posts;
    return posts.filter((p) =>
      (p.node.categories || []).some((c) => c.slug === active)
    );
  }, [posts, active]);

  return (
    <div>
      <Head>
        <title>Ryo Miyata — Posts</title>
      </Head>

      <div className="px-5 pt-7 pb-3">
        <div className="font-pixel text-[26px] leading-none">
          <span className="opacity-50">// </span>posts
        </div>
        <div className="font-vt text-[14px] opacity-65 mt-1.5">
          all entries · sorted by date desc · {filtered.length} items
        </div>
      </div>
      <DitherBlock />

      {/* Filter */}
      <div className="flex gap-2 px-5 py-2.5 border-b border-current font-pixel text-[10px] flex-wrap">
        <span className="opacity-55">filter:</span>
        <button
          onClick={() => setActive("all")}
          className={`border border-current px-1.5 ${active === "all" ? "bg-[var(--fg)] text-[var(--bg)]" : ""}`}
        >
          all
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`border border-current px-1.5 ${active === c.slug ? "bg-[var(--fg)] text-[var(--bg)]" : ""}`}
          >
            {c.slug}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {filtered.map((p) => (
          <Link
            key={p.node.slug}
            href={`/post/${p.node.slug}`}
            className="grid grid-cols-[56px_1fr_auto] gap-4 items-baseline px-5 py-3.5 border-b border-current border-dashed text-[14px] no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            <span className="font-pixel text-[11px] opacity-65">
              {new Date(p.node.createdAt).toISOString().slice(0, 7).replace("-", ".")}
            </span>
            <span>{p.node.title}</span>
            <span className="font-pixel text-[9px] border border-current px-1.5 opacity-85 whitespace-nowrap">
              {p.node.categories?.[0]?.slug?.toUpperCase() || "—"}
            </span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center font-vt text-[14px] opacity-65">
            no entries for this filter.
          </div>
        )}
      </div>

      {/* External legacy links (preserve old hardcoded entries) */}
      <div className="px-5 py-4 border-t border-current">
        <div className="font-pixel text-[10px] opacity-55 mb-2">// external</div>
        <a
          href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
          target="_blank"
          rel="noopener noreferrer"
          className="grid grid-cols-[56px_1fr_auto] gap-4 items-baseline py-2 border-b border-current border-dashed text-[13px] no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
        >
          <span className="font-pixel text-[11px] opacity-65">2023.01</span>
          <span>人を表すソウルバンドトークンとよばれるNFT</span>
          <span className="font-pixel text-[9px] opacity-60 whitespace-nowrap">↗ note</span>
        </a>
        <a
          href="https://qiita.com/MiyataRyo/items/6a5f6aa510afddae0701"
          target="_blank"
          rel="noopener noreferrer"
          className="grid grid-cols-[56px_1fr_auto] gap-4 items-baseline py-2 border-b border-current border-dashed text-[13px] no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
        >
          <span className="font-pixel text-[11px] opacity-65">2020.03</span>
          <span>Heroku への Rails+MySQL デプロイ</span>
          <span className="font-pixel text-[9px] opacity-60 whitespace-nowrap">↗ qiita</span>
        </a>
      </div>

      <StatusBar left={`showing: ${active}`} right={`${filtered.length} items`} />
    </div>
  );
};

export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  const categories = (await getCategories()) || [];
  return { props: { posts, categories } };
}

export default PostIndex;
