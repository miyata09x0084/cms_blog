import React from 'react';
import Link from 'next/link';
import { DitherBlock } from './ui';

const PostDetail = ({ post }) => {
  const date = post?.createdAt
    ? new Date(post.createdAt).toISOString().slice(0, 10).replace(/-/g, '.')
    : '';
  const cats = (post?.categories || []).map((c) => c.name?.toUpperCase()).join(' · ');

  const getContentFragment = (index, text, obj, type) => {
    let modifiedText = text;

    if (obj) {
      if (obj.bold)      modifiedText = <b key={index}>{text}</b>;
      if (obj.italic)    modifiedText = <em key={index}>{text}</em>;
      if (obj.underline) modifiedText = <u key={index}>{text}</u>;
    }

    switch (type) {
      case 'heading-three':
        return (
          <h3 key={index} className="font-pixel text-[14px] tracking-wider mt-7 mb-2">
            <span className="opacity-50">## </span>
            {modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}
          </h3>
        );
      case 'heading-four':
        return (
          <h4 key={index} className="font-pixel text-[12px] tracking-wider mt-5 mb-2">
            <span className="opacity-50">### </span>
            {modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}
          </h4>
        );
      case 'paragraph':
        return (
          <p key={index} className="mb-5 leading-[1.85]">
            {modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}
          </p>
        );
      case 'image':
        return (
          <div key={index} className="my-6 border border-current p-1">
            <img alt={obj.title} height={obj.height} width={obj.width} src={obj.src} className="block" />
          </div>
        );
      case 'code-block':
        return (
          <pre
            key={index}
            className="font-mono text-[13px] leading-[1.6] border border-current p-3 my-5 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: modifiedText }}
          />
        );
      default:
        return modifiedText;
    }
  };

  return (
    <article>
      <header className="px-6 pt-7 pb-5">
        {cats && (
          <span className="inline-block font-pixel text-[9px] border border-current px-1.5 py-0.5 opacity-85">
            {cats}
          </span>
        )}
        <h1 className="font-jp text-[28px] leading-[1.35] font-bold mt-3 mb-3">
          {post.title}
        </h1>
        <div className="font-vt text-[14px] opacity-65">
          {date} · ryo miyata
        </div>
      </header>

      <DitherBlock />

      <div className="font-body px-6 py-6 text-[15px] leading-[1.85]">
        {post.content?.raw?.children?.map((typeObj, index) => {
          const children = typeObj.children.map((item, itemIndex) =>
            getContentFragment(itemIndex, item.text, item)
          );
          return getContentFragment(index, children, typeObj, typeObj.type);
        })}
      </div>

      <div className="px-6 py-4 border-t border-current border-dashed flex gap-4 font-pixel text-[10px]">
        <Link href="/post" className="underline">◂ back to posts</Link>
      </div>
    </article>
  );
};

export default PostDetail;
